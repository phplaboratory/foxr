import JSHandle from './JSHandle';
import { pWriteFile, MOUSE_BUTTON, hasKey } from '../utils';
import KEYS from '../keys';

class ElementHandle extends JSHandle {
  constructor(params) {
    super(params);
    this._page = params.page;
    this._send = params.send;
    this._actionId = null;
  }

  async _scrollIntoView() {
    await this._page.evaluate(el => {
      el.scrollIntoView();
    }, this._handleId);
  }

  async $(selector) {
    try {
      const id = await this._send('WebDriver:FindElement', {
        element: this._elementId,
        value: selector,
        using: 'css selector'
      }, 'value');
      return new ElementHandle({
        page: this._page,
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
      element: this._elementId,
      value: selector,
      using: 'css selector'
    });
    return ids.map(id => new ElementHandle({
      page: this._page,
      id,
      send: this._send
    }));
  }

  async click(userOptions) {
    const options = {
      button: 'left',
      clickCount: 1,
      ...userOptions
    };
    const mouseButton = MOUSE_BUTTON[options.button];
    await this._scrollIntoView();
    const id = await this._send('Marionette:ActionChain', {
      chain: [['click', this._elementId, mouseButton, options.clickCount]],
      nextId: this._actionId
    }, 'value');
    this._actionId = id;
  }

  async focus() {
    await this._send('WebDriver:ExecuteScript', {
      'script': 'arguments[0].focus()',
      args: [this._handleId]
    });
  }

  async hover() {
    await this._scrollIntoView();
    const id = await this._send('Marionette:ActionChain', {
      chain: [['move', this._elementId]],
      nextId: this._actionId
    }, 'value');
    this._actionId = id;
  }

  async press(key) {
    if (hasKey(KEYS, key)) {
      await this._send('WebDriver:ElementSendKeys', {
        id: this._elementId,
        text: KEYS[key]
      });
      return;
    }

    if (key.length === 1) {
      await this._send('WebDriver:ElementSendKeys', {
        id: this._elementId,
        text: key
      });
      return;
    }

    throw new Error(`Unknown key: ${key}`);
  }

  async screenshot(options = {}) {
    const result = await this._send('WebDriver:TakeScreenshot', {
      id: this._elementId,
      full: false,
      hash: false
    }, 'value');
    const buffer = Buffer.from(result, 'base64');

    if (typeof options.path === 'string') {
      await pWriteFile(options.path, buffer);
    }

    return buffer;
  }

  async type(text) {
    await this._send('WebDriver:ElementSendKeys', {
      id: this._elementId,
      text
    });
  }

}

export default ElementHandle;