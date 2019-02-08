import EventEmitter from 'events';
import { pWriteFile, mapEvaluateArgs } from '../utils';
import ElementHandle from './ElementHandle';
import JSHandle from './JSHandle';
const cache = new Map();

class Page extends EventEmitter {
  constructor(params) {
    super();
    this._browser = params.browser;
    this._id = params.id;
    this._send = params.send;

    if (cache.has(params.id)) {
      return cache.get(params.id);
    }

    cache.set(params.id, this);
    params.browser.on('disconnected', async () => {
      this.emit('close');
      cache.clear();
    });
  }

  async $(selector) {
    try {
      const id = await this._send('WebDriver:FindElement', {
        value: selector,
        using: 'css selector'
      }, 'value');
      return new ElementHandle({
        page: this,
        id,
        send: this._send
      });
    } catch (err) {
      if (err.message.startsWith('Unable to locate element')) {
        return null;
      }

      throw err;
    }
  }

  async $$(selector) {
    const ids = await this._send('WebDriver:FindElements', {
      value: selector,
      using: 'css selector'
    });
    return ids.map(id => new ElementHandle({
      page: this,
      id,
      send: this._send
    }));
  }

  async $eval(selector, func, ...args) {
    const result = await this._send('WebDriver:ExecuteAsyncScript', {
      script: `
        const resolve = arguments[arguments.length - 1]
        const el = document.querySelector(arguments[0])
        const args = Array.prototype.slice.call(arguments, 1, arguments.length - 1)

        if (el === null) {
          return resolve({ error: 'unable to find element' })
        }

        Promise.resolve()
          .then(() => (${func.toString()})(el, ...args))
          .then((value) => resolve({ error: null, value }))
          .catch((error) => resolve({ error: error instanceof Error ? error.message : error }))
      `,
      args: [selector, ...mapEvaluateArgs(args)]
    }, 'value');

    if (result.error !== null) {
      throw new Error(`Evaluation failed: ${result.error}`);
    }

    return result.value;
  }

  async $$eval(selector, func, ...args) {
    const result = await this._send('WebDriver:ExecuteAsyncScript', {
      script: `
        const resolve = arguments[arguments.length - 1]
        const els = Array.from(document.querySelectorAll(arguments[0]))
        const args = Array.prototype.slice.call(arguments, 1, arguments.length - 1)

        Promise.all(
          els.map((el) => Promise.resolve().then(() => (${func.toString()})(el, ...args)))
        )
        .then((value) => resolve({ error: null, value }))
        .catch((error) => resolve({ error: error instanceof Error ? error.message : error }))
      `,
      args: [selector, ...mapEvaluateArgs(args)]
    }, 'value');

    if (result.error !== null) {
      throw new Error(`Evaluation failed: ${result.error}`);
    }

    return result.value;
  }

  async bringToFront() {
    await this._send('WebDriver:SwitchToWindow', {
      name: this._id,
      focus: true
    });
  }

  browser() {
    return this._browser;
  }

  async close() {
    await this._send('WebDriver:ExecuteScript', {
      script: 'window.close()'
    });
    this.emit('close');
    cache.delete(this._id);
  }

  content() {
    return this._send('WebDriver:GetPageSource', {}, 'value');
  }

  async evaluate(target, ...args) {
    let result = null;

    if (typeof target === 'function') {
      result = await this._send('WebDriver:ExecuteAsyncScript', {
        script: `
          const args = Array.prototype.slice.call(arguments, 0, arguments.length - 1)
          const resolve = arguments[arguments.length - 1]

          Promise.resolve()
            .then(() => (${target.toString()})(...args))
            .then((value) => resolve({ error: null, value }))
            .catch((error) => resolve({ error: error instanceof Error ? error.message : error }))
        `,
        args: mapEvaluateArgs(args)
      }, 'value');
    } else {
      result = await this._send('WebDriver:ExecuteAsyncScript', {
        script: `
          const resolve = arguments[0]

          Promise.resolve()
            .then(() => ${target})
            .then((value) => resolve({ error: null, value }))
            .catch((error) => resolve({ error: error instanceof Error ? error.message : error }))
        `
      }, 'value');
    }

    if (result.error !== null) {
      throw new Error(`Evaluation failed: ${result.error}`);
    }

    return result.value;
  }

  async evaluateHandle(target, ...args) {
    let result = null;

    if (typeof target === 'function') {
      result = await this._send('WebDriver:ExecuteAsyncScript', {
        script: `
          const args = Array.prototype.slice.call(arguments, 0, arguments.length - 1)
          const resolve = arguments[arguments.length - 1]

          Promise.resolve()
            .then(() => (${target.toString()})(...args))
            .then((value) => {
              if (value instanceof Element) {
                resolve({ error: null, value })
              } else {
                resolve({ error: null, value: null })
              }
            })
            .catch((error) => resolve({ error: error instanceof Error ? error.message : error }))
        `,
        args: mapEvaluateArgs(args)
      }, 'value');
    } else {
      result = await this._send('WebDriver:ExecuteAsyncScript', {
        script: `
          const resolve = arguments[0]

          Promise.resolve()
            .then(() => ${target})
            .then((value) => {
              if (value instanceof Element) {
                resolve({ error: null, value })
              } else {
                resolve({ error: null, value: null })
              }
            })
            .catch((error) => resolve({ error: error instanceof Error ? error.message : error }))
        `
      }, 'value');
    }

    if (result.error !== null) {
      throw new Error(`Evaluation failed: ${result.error}`);
    }

    if (result.value === null) {
      throw new Error('Unable to get a JSHandle');
    }

    return new JSHandle({
      page: this,
      id: result.value,
      send: this._send
    });
  }

  async focus(selector) {
    await this.evaluate(`{
      const el = document.querySelector('${selector}')

      if (el === null) {
        throw new Error('unable to find element')
      }

      if (!(el instanceof HTMLElement)) {
        throw new Error('Found element is not HTMLElement and not focusable')
      }

      el.focus()
    }`);
  }

  async goto(url) {
    await this._send('WebDriver:Navigate', {
      url
    });
  }

  async screenshot(options = {}) {
    const result = await this._send('WebDriver:TakeScreenshot', {
      full: true,
      hash: false
    }, 'value');
    const buffer = Buffer.from(result, 'base64');

    if (typeof options.path === 'string') {
      await pWriteFile(options.path, buffer);
    }

    return buffer;
  }

  async setContent(html) {
    await this._send('WebDriver:ExecuteScript', {
      script: 'document.documentElement.innerHTML = arguments[0]',
      args: [html]
    });
  }

  title() {
    return this._send('WebDriver:GetTitle', {}, 'value');
  }

  url() {
    return this._send('WebDriver:GetCurrentURL', {}, 'value');
  }

  async viewport() {
    return await this.evaluate(`
      ({
        width: window.innerWidth,
        height: window.innerHeight
      })
    `);
  }

}

export default Page;