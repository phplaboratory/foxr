"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
/* eslint-disable no-use-before-define */
var execa_1 = require("execa");
// @ts-ignore
var signal_exit_1 = require("signal-exit");
var Marionette_1 = require("../Marionette");
var Browser_1 = require("./Browser");
var utils_1 = require("../utils");
var DEFAULT_HOST = 'localhost';
var DEFAULT_PORT = 2828;
var Foxr = /** @class */ (function () {
    function Foxr() {
    }
    Foxr.prototype._setViewport = function (send, _a) {
        var width = _a.width, height = _a.height;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, send('WebDriver:ExecuteScript', {
                            script: "return {\n        widthDelta: window.outerWidth - window.innerWidth,\n        heightDelta: window.outerHeight - window.innerHeight\n      }"
                        })];
                    case 1:
                        result = (_b.sent()).value;
                        return [4 /*yield*/, send('WebDriver:SetWindowRect', {
                                width: width + result.widthDelta,
                                height: height + result.heightDelta
                            })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Foxr.prototype.connect = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, host, port, _b, width, height, marionette, browser;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = __assign({ host: DEFAULT_HOST, port: DEFAULT_PORT }, options, { defaultViewport: __assign({ width: 800, height: 600 }, options && options.defaultViewport) }), host = _a.host, port = _a.port, _b = _a.defaultViewport, width = _b.width, height = _b.height;
                        marionette = new Marionette_1["default"]();
                        return [4 /*yield*/, marionette.connect(host, port)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, marionette.send('WebDriver:NewSession', { capabilities: {} })];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, this._setViewport(marionette.send, { width: width, height: height })];
                    case 3:
                        _c.sent();
                        browser = new Browser_1["default"]({ send: marionette.send });
                        marionette.once('close', function (_a) {
                            var isManuallyClosed = _a.isManuallyClosed;
                            return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_b) {
                                    if (!isManuallyClosed) {
                                        browser.emit('disconnected');
                                    }
                                    return [2 /*return*/];
                                });
                            });
                        });
                        browser.once('disconnected', function () {
                            marionette.disconnect();
                        });
                        return [2 /*return*/, browser];
                }
            });
        });
    };
    Foxr.prototype.launch = function (userOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var options, args, firefoxProcess;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = __assign({ headless: true, dumpio: false }, userOptions);
                        if (typeof options.executablePath !== 'string') {
                            throw new Error('`executablePath` option is required, Foxr doesn\'t download Firefox automatically');
                        }
                        args = ['-marionette', '-safe-mode', '-no-remote'];
                        if (options.headless === true) {
                            args.push('-headless');
                        }
                        if (Array.isArray(options.args)) {
                            args.push.apply(args, options.args);
                        }
                        firefoxProcess = execa_1["default"](options.executablePath, args, {
                            detached: true,
                            stdio: options.dumpio ? 'inherit' : 'ignore'
                        });
                        signal_exit_1["default"](function () {
                            firefoxProcess.kill();
                        });
                        firefoxProcess.unref();
                        return [4 /*yield*/, utils_1.waitForPort(DEFAULT_HOST, DEFAULT_PORT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.connect(options)];
                }
            });
        });
    };
    return Foxr;
}());
exports["default"] = Foxr;
