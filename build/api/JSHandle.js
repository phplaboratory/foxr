import EventEmitter from 'events';
import { getElementId } from '../utils';
const cache = new Map();

class JSHandle extends EventEmitter {
  constructor(params) {
    super();
    this._handleId = params.id;
    this._elementId = getElementId(params.id);

    if (cache.has(this._elementId)) {
      return cache.get(this._elementId);
    }

    cache.set(this._elementId, this);
    params.page.on('close', () => {
      cache.clear();
    });
  }

}

export default JSHandle;