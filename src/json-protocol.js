"use strict";
exports.__esModule = true;
var stream_1 = require("stream");
var typeon_1 = require("typeon");
var SEPARATOR = ':';
var SEPARATOR_CODE = SEPARATOR.charCodeAt(0);
exports.createParseStream = function () {
    var remainingLength = 0;
    var currentBuffer = Buffer.alloc(0);
    return new stream_1.Transform({
        readableObjectMode: true,
        transform: function (chunk, encoding, callback) {
            var pos = 0;
            if (remainingLength === 0) {
                pos = chunk.indexOf(SEPARATOR_CODE);
                remainingLength = parseInt(chunk.slice(0, pos).toString(), 10);
                pos += 1;
            }
            var remainingData = chunk.slice(pos, pos + remainingLength);
            currentBuffer = Buffer.concat([currentBuffer, remainingData]);
            remainingLength -= remainingData.length;
            pos += remainingData.length;
            if (remainingLength === 0) {
                this.push(typeon_1.jsonParse(currentBuffer.toString()));
                currentBuffer = Buffer.alloc(0);
            }
            if (pos < chunk.length) {
                return this._transform(chunk.slice(pos), encoding, callback);
            }
            callback();
        }
    });
};
exports.parse = function (buf) {
    var stream = exports.createParseStream();
    var result = {};
    stream.once('data', function (data) {
        result = data;
    });
    stream.write(buf);
    stream.end();
    return result;
};
exports.stringify = function (data) {
    var str = typeon_1.jsonStringify(data);
    var length = Buffer.byteLength(str);
    return "" + length + SEPARATOR + str;
};
