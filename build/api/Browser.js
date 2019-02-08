import EventEmitter from 'events';
import Page from './Page';

class Browser extends EventEmitter {
  constructor(arg) {
    super();
    this._send = arg.send;
  }

  async close() {
    await this._send('Marionette:AcceptConnections', {
      value: false
    });
    await this._send('Marionette:Quit');
    this.emit('disconnected');
  }

  async disconnect() {
    await this._send('WebDriver:DeleteSession');
    this.emit('disconnected');
  }

  async newPage() {
    await this._send('WebDriver:ExecuteScript', {
      script: 'window.open()'
    });
    const pages = await this._send('WebDriver:GetWindowHandles');
    const newPageId = pages[pages.length - 1];
    await this._send('WebDriver:SwitchToWindow', {
      name: newPageId,
      focus: true
    });
    return new Page({
      browser: this,
      id: newPageId,
      send: this._send
    });
  }

  async pages() {
    const ids = await this._send('WebDriver:GetWindowHandles');
    return ids.map(id => new Page({
      browser: this,
      id,
      send: this._send
    }));
  }

}

export default Browser;