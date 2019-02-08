import execa from 'execa';
import onExit from 'signal-exit';
import Marionette from '../Marionette';
import Browser from './Browser';
import { waitForPort } from '../utils';
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 2828;

class Foxr {
  async _setViewport(send, {
    width,
    height
  }) {
    const {
      value: result
    } = await send('WebDriver:ExecuteScript', {
      script: `return {
        widthDelta: window.outerWidth - window.innerWidth,
        heightDelta: window.outerHeight - window.innerHeight
      }`
    });
    await send('WebDriver:SetWindowRect', {
      width: width + result.widthDelta,
      height: height + result.heightDelta
    });
  }

  async connect(options) {
    const {
      host,
      port,
      defaultViewport: {
        width,
        height
      }
    } = {
      host: DEFAULT_HOST,
      port: DEFAULT_PORT,
      ...options,
      defaultViewport: {
        width: 800,
        height: 600,
        ...(options && options.defaultViewport)
      }
    };
    const marionette = new Marionette();
    await marionette.connect(host, port);
    await marionette.send('WebDriver:NewSession', {
      capabilities: {}
    });
    await this._setViewport(marionette.send, {
      width,
      height
    });
    const browser = new Browser({
      send: marionette.send
    });
    marionette.once('close', async ({
      isManuallyClosed
    }) => {
      if (!isManuallyClosed) {
        browser.emit('disconnected');
      }
    });
    browser.once('disconnected', () => {
      marionette.disconnect();
    });
    return browser;
  }

  async launch(userOptions) {
    const options = {
      headless: true,
      dumpio: false,
      ...userOptions
    };

    if (typeof options.executablePath !== 'string') {
      throw new Error('`executablePath` option is required, Foxr doesn\'t download Firefox automatically');
    }

    const args = ['-marionette', '-safe-mode', '-no-remote'];

    if (options.headless === true) {
      args.push('-headless');
    }

    if (Array.isArray(options.args)) {
      args.push(...options.args);
    }

    const firefoxProcess = execa(options.executablePath, args, {
      detached: true,
      stdio: options.dumpio ? 'inherit' : 'ignore'
    });
    onExit(() => {
      firefoxProcess.kill();
    });
    firefoxProcess.unref();
    await waitForPort(DEFAULT_HOST, DEFAULT_PORT);
    return this.connect(options);
  }

}

export default Foxr;