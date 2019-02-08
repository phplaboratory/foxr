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
/* eslint-disable no-use-before-define */
var events_1 = require("events");
var utils_1 = require("../utils");
var ElementHandle_1 = require("./ElementHandle");
var JSHandle_1 = require("./JSHandle");
var cache = new Map();
var Page = /** @class */ (function (_super) {
    __extends(Page, _super);
    function Page(params) {
        var _this = _super.call(this) || this;
        _this._browser = params.browser;
        _this._id = params.id;
        _this._send = params.send;
        if (cache.has(params.id)) {
            return cache.get(params.id);
        }
        cache.set(params.id, _this);
        params.browser.on('disconnected', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.emit('close');
                cache.clear();
                return [2 /*return*/];
            });
        }); });
        return _this;
    }
    Page.prototype.$ = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            var id, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._send('WebDriver:FindElement', {
                                value: selector,
                                using: 'css selector'
                            }, 'value')];
                    case 1:
                        id = _a.sent();
                        return [2 /*return*/, new ElementHandle_1["default"]({
                                page: this,
                                id: id,
                                send: this._send
                            })];
                    case 2:
                        err_1 = _a.sent();
                        if (err_1.message.startsWith('Unable to locate element')) {
                            return [2 /*return*/, null];
                        }
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.$$ = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            var ids;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:FindElements', {
                            value: selector,
                            using: 'css selector'
                        })];
                    case 1:
                        ids = _a.sent();
                        return [2 /*return*/, ids.map(function (id) { return new ElementHandle_1["default"]({
                                page: _this,
                                id: id,
                                send: _this._send
                            }); })];
                }
            });
        });
    };
    Page.prototype.$eval = function (selector, func) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:ExecuteAsyncScript', {
                            script: "\n        const resolve = arguments[arguments.length - 1]\n        const el = document.querySelector(arguments[0])\n        const args = Array.prototype.slice.call(arguments, 1, arguments.length - 1)\n\n        if (el === null) {\n          return resolve({ error: 'unable to find element' })\n        }\n\n        Promise.resolve()\n          .then(() => (" + func.toString() + ")(el, ...args))\n          .then((value) => resolve({ error: null, value }))\n          .catch((error) => resolve({ error: error instanceof Error ? error.message : error }))\n      ",
                            args: [selector].concat(utils_1.mapEvaluateArgs(args))
                        }, 'value')];
                    case 1:
                        result = _a.sent();
                        if (result.error !== null) {
                            throw new Error("Evaluation failed: " + result.error);
                        }
                        return [2 /*return*/, result.value];
                }
            });
        });
    };
    Page.prototype.$$eval = function (selector, func) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:ExecuteAsyncScript', {
                            script: "\n        const resolve = arguments[arguments.length - 1]\n        const els = Array.from(document.querySelectorAll(arguments[0]))\n        const args = Array.prototype.slice.call(arguments, 1, arguments.length - 1)\n\n        Promise.all(\n          els.map((el) => Promise.resolve().then(() => (" + func.toString() + ")(el, ...args)))\n        )\n        .then((value) => resolve({ error: null, value }))\n        .catch((error) => resolve({ error: error instanceof Error ? error.message : error }))\n      ",
                            args: [selector].concat(utils_1.mapEvaluateArgs(args))
                        }, 'value')];
                    case 1:
                        result = _a.sent();
                        if (result.error !== null) {
                            throw new Error("Evaluation failed: " + result.error);
                        }
                        return [2 /*return*/, result.value];
                }
            });
        });
    };
    Page.prototype.bringToFront = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:SwitchToWindow', {
                            name: this._id,
                            focus: true
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.browser = function () {
        return this._browser;
    };
    Page.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:ExecuteScript', {
                            script: 'window.close()'
                        })];
                    case 1:
                        _a.sent();
                        this.emit('close');
                        cache["delete"](this._id);
                        return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.content = function () {
        return this._send('WebDriver:GetPageSource', {}, 'value');
    };
    Page.prototype.evaluate = function (target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = null;
                        if (!(typeof target === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._send('WebDriver:ExecuteAsyncScript', {
                                script: "\n          const args = Array.prototype.slice.call(arguments, 0, arguments.length - 1)\n          const resolve = arguments[arguments.length - 1]\n\n          Promise.resolve()\n            .then(() => (" + target.toString() + ")(...args))\n            .then((value) => resolve({ error: null, value }))\n            .catch((error) => resolve({ error: error instanceof Error ? error.message : error }))\n        ",
                                args: utils_1.mapEvaluateArgs(args)
                            }, 'value')];
                    case 1:
                        result = (_a.sent());
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this._send('WebDriver:ExecuteAsyncScript', {
                            script: "\n          const resolve = arguments[0]\n\n          Promise.resolve()\n            .then(() => " + target + ")\n            .then((value) => resolve({ error: null, value }))\n            .catch((error) => resolve({ error: error instanceof Error ? error.message : error }))\n        "
                        }, 'value')];
                    case 3:
                        result = (_a.sent());
                        _a.label = 4;
                    case 4:
                        if (result.error !== null) {
                            throw new Error("Evaluation failed: " + result.error);
                        }
                        return [2 /*return*/, result.value];
                }
            });
        });
    };
    Page.prototype.evaluateHandle = function (target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = null;
                        if (!(typeof target === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._send('WebDriver:ExecuteAsyncScript', {
                                script: "\n          const args = Array.prototype.slice.call(arguments, 0, arguments.length - 1)\n          const resolve = arguments[arguments.length - 1]\n\n          Promise.resolve()\n            .then(() => (" + target.toString() + ")(...args))\n            .then((value) => {\n              if (value instanceof Element) {\n                resolve({ error: null, value })\n              } else {\n                resolve({ error: null, value: null })\n              }\n            })\n            .catch((error) => resolve({ error: error instanceof Error ? error.message : error }))\n        ",
                                args: utils_1.mapEvaluateArgs(args)
                            }, 'value')];
                    case 1:
                        result = (_a.sent());
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this._send('WebDriver:ExecuteAsyncScript', {
                            script: "\n          const resolve = arguments[0]\n\n          Promise.resolve()\n            .then(() => " + target + ")\n            .then((value) => {\n              if (value instanceof Element) {\n                resolve({ error: null, value })\n              } else {\n                resolve({ error: null, value: null })\n              }\n            })\n            .catch((error) => resolve({ error: error instanceof Error ? error.message : error }))\n        "
                        }, 'value')];
                    case 3:
                        result = (_a.sent());
                        _a.label = 4;
                    case 4:
                        if (result.error !== null) {
                            throw new Error("Evaluation failed: " + result.error);
                        }
                        if (result.value === null) {
                            throw new Error('Unable to get a JSHandle');
                        }
                        return [2 /*return*/, new JSHandle_1["default"]({
                                page: this,
                                id: result.value,
                                send: this._send
                            })];
                }
            });
        });
    };
    Page.prototype.focus = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.evaluate("{\n      const el = document.querySelector('" + selector + "')\n\n      if (el === null) {\n        throw new Error('unable to find element')\n      }\n\n      if (!(el instanceof HTMLElement)) {\n        throw new Error('Found element is not HTMLElement and not focusable')\n      }\n\n      el.focus()\n    }")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.goto = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:Navigate', { url: url })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.screenshot = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var result, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:TakeScreenshot', {
                            full: true,
                            hash: false
                        }, 'value')];
                    case 1:
                        result = _a.sent();
                        buffer = Buffer.from(result, 'base64');
                        if (!(typeof options.path === 'string')) return [3 /*break*/, 3];
                        return [4 /*yield*/, utils_1.pWriteFile(options.path, buffer)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, buffer];
                }
            });
        });
    };
    Page.prototype.setContent = function (html) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:ExecuteScript', {
                            script: 'document.documentElement.innerHTML = arguments[0]',
                            args: [html]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.title = function () {
        return this._send('WebDriver:GetTitle', {}, 'value');
    };
    Page.prototype.url = function () {
        return this._send('WebDriver:GetCurrentURL', {}, 'value');
    };
    Page.prototype.viewport = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.evaluate("\n      ({\n        width: window.innerWidth,\n        height: window.innerHeight\n      })\n    ")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Page.prototype.goBack = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:Back', {})];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Page.prototype.goForward = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:Forward', {})];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Page;
}(events_1["default"]));
exports["default"] = Page;
