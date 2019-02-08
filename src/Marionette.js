"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var events_1 = require("events");
var net_1 = require("net");
var Error_1 = require("./Error");
var json_protocol_1 = require("./json-protocol");
var CONNECTION_TIMEOUT = 5 * 60 * 1000; // 5 min
var Marionette = /** @class */ (function (_super) {
    __extends(Marionette, _super);
    function Marionette() {
        var _this = _super.call(this) || this;
        _this.globalId = 0;
        _this.queue = [];
        _this.socket = new net_1.Socket();
        _this.isManuallyClosed = false;
        _this.send = _this.send.bind(_this);
        return _this;
    }
    Marionette.prototype.connect = function (host, port) {
        return __awaiter(this, void 0, void 0, function () {
            var parseStream;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // TODO: extract everything about socket as separate "transport" module
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var rejectAndDestroy = function (error) {
                                reject(error);
                                _this.socket.destroy();
                            };
                            _this.socket
                                .setTimeout(CONNECTION_TIMEOUT)
                                .once('connect', function () {
                                _this.socket.once('data', function (rawData) {
                                    var data = json_protocol_1.parse(rawData);
                                    if (data.applicationType === 'gecko') {
                                        if (data.marionetteProtocol === 3) {
                                            return resolve();
                                        }
                                        return rejectAndDestroy(new Error_1["default"]('Foxr works only with Marionette protocol v3'));
                                    }
                                    rejectAndDestroy(new Error_1["default"]('Unsupported Marionette protocol'));
                                });
                            })
                                .once('timeout', function () { return rejectAndDestroy(new Error('Socket connection timeout')); })
                                .once('error', function (err) { return rejectAndDestroy(err); })
                                .once('end', function () {
                                _this.emit('close', { isManuallyClosed: _this.isManuallyClosed });
                            })
                                .connect(port, host);
                        })];
                    case 1:
                        // TODO: extract everything about socket as separate "transport" module
                        _a.sent();
                        parseStream = json_protocol_1.createParseStream();
                        parseStream.on('data', function (data) {
                            var type = data[0], id = data[1], error = data[2], result = data[3];
                            if (type === 1) {
                                _this.queue = _this.queue.filter(function (item) {
                                    if (item.id === id) {
                                        if (error !== null) {
                                            item.reject(new Error_1["default"](error.message));
                                        }
                                        else if (typeof item.key === 'string') {
                                            item.resolve(result[item.key]);
                                        }
                                        else {
                                            item.resolve(result);
                                        }
                                        return false;
                                    }
                                    return true;
                                });
                            }
                        });
                        this.socket.pipe(parseStream);
                        return [2 /*return*/];
                }
            });
        });
    };
    Marionette.prototype.disconnect = function () {
        this.isManuallyClosed = true;
        this.socket.end();
    };
    Marionette.prototype.send = function (name, params, key) {
        if (params === void 0) { params = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var globalId = _this.globalId++;
                        var data = json_protocol_1.stringify([0, globalId, name, params]);
                        _this.socket.write(data, 'utf8', function () {
                            _this.queue.push({ id: globalId, key: key, resolve: resolve, reject: reject });
                        });
                    })];
            });
        });
    };
    return Marionette;
}(events_1["default"]));
exports["default"] = Marionette;
