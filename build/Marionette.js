import EventEmitter from 'events';
import { Socket } from 'net';
import FoxrError from './Error';
import { createParseStream, parse, stringify } from './json-protocol';
const CONNECTION_TIMEOUT = 5*60*1000 // 5 min

class Marionette extends EventEmitter {
  constructor() {
    super();
    this.globalId = 0;
    this.queue = [];
    this.socket = new Socket();
    this.isManuallyClosed = false;
    this.send = this.send.bind(this);
  }

  async connect(host, port) {
    await new Promise((resolve, reject) => {
      const rejectAndDestroy = error => {
        reject(error);
        this.socket.destroy();
      };

      this.socket.setTimeout(CONNECTION_TIMEOUT).once('connect', () => {
        this.socket.once('data', rawData => {
          const data = parse(rawData);

          if (data.applicationType === 'gecko') {
            if (data.marionetteProtocol === 3) {
              return resolve();
            }

            return rejectAndDestroy(new FoxrError('Foxr works only with Marionette protocol v3'));
          }

          rejectAndDestroy(new FoxrError('Unsupported Marionette protocol'));
        });
      }).once('timeout', () => rejectAndDestroy(new Error('Socket connection timeout'))).once('error', err => rejectAndDestroy(err)).once('end', () => {
        this.emit('close', {
          isManuallyClosed: this.isManuallyClosed
        });
      }).connect(port, host);
    });
    const parseStream = createParseStream();
    parseStream.on('data', data => {
      const [type, id, error, result] = data;

      if (type === 1) {
        this.queue = this.queue.filter(item => {
          if (item.id === id) {
            if (error !== null) {
              item.reject(new FoxrError(error.message));
            } else if (typeof item.key === 'string') {
              item.resolve(result[item.key]);
            } else {
              item.resolve(result);
            }

            return false;
          }

          return true;
        });
      }
    });
    this.socket.pipe(parseStream);
  }

  disconnect() {
    this.isManuallyClosed = true;
    this.socket.end();
  }

  async send(name, params = {}, key) {
    return new Promise((resolve, reject) => {
      const globalId= this.globalId++ ;
      const data = stringify([0, globalId, name, params]);
      this.socket.write(data, 'utf8', () => {
        this.queue.push({
          id: globalId,
          key,
          resolve,
          reject
        });
      });
    });
  }

}

export default Marionette;
