import { Transform } from 'stream';
import { jsonParse, jsonStringify } from 'typeon';
const SEPARATOR = ':';
const SEPARATOR_CODE = SEPARATOR.charCodeAt(0);
export const createParseStream = () => {
  let remainingLength = 0;
  let currentBuffer = Buffer.alloc(0);
  return new Transform({
    readableObjectMode: true,

    transform(chunk, encoding, callback) {
      let pos = 0;

      if (remainingLength === 0) {
        pos = chunk.indexOf(SEPARATOR_CODE);
        remainingLength = parseInt(chunk.slice(0, pos).toString(), 10);
        pos += 1;
      }

      const remainingData = chunk.slice(pos, pos + remainingLength);
      currentBuffer = Buffer.concat([currentBuffer, remainingData]);
      remainingLength -= remainingData.length;
      pos += remainingData.length;

      if (remainingLength === 0) {
        this.push(jsonParse(currentBuffer.toString()));
        currentBuffer = Buffer.alloc(0);
      }

      if (pos < chunk.length) {
        return this._transform(chunk.slice(pos), encoding, callback);
      }

      callback();
    }

  });
};
export const parse = buf => {
  const stream = createParseStream();
  let result = {};
  stream.once('data', data => {
    result = data;
  });
  stream.write(buf);
  stream.end();
  return result;
};
export const stringify = data => {
  const str = jsonStringify(data);
  const length = Buffer.byteLength(str);
  return `${length}${SEPARATOR}${str}`;
};