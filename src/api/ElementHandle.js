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
var JSHandle_1 = require("./JSHandle");
var utils_1 = require("../utils");
var keys_1 = require("../keys");
var ElementHandle = /** @class */ (function (_super) {
    __extends(ElementHandle, _super);
    function ElementHandle(params) {
        var _this = _super.call(this, params) || this;
        _this._page = params.page;
        _this._send = params.send;
        _this._actionId = null;
        return _this;
    }
    ElementHandle.prototype._scrollIntoView = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    /* istanbul ignore next */
                    return [4 /*yield*/, this._page.evaluate(function (el) {
                            el.scrollIntoView();
                        }, this._handleId)];
                    case 1:
                        /* istanbul ignore next */
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ElementHandle.prototype.$ = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            var id, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._send('WebDriver:FindElement', {
                                element: this._elementId,
                                value: selector,
                                using: 'css selector'
                            }, 'value')];
                    case 1:
                        id = _a.sent();
                        return [2 /*return*/, new ElementHandle({
                                page: this._page,
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
    ElementHandle.prototype.$$ = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            var ids;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:FindElements', {
                            element: this._elementId,
                            value: selector,
                            using: 'css selector'
                        })];
                    case 1:
                        ids = _a.sent();
                        return [2 /*return*/, ids.map(function (id) { return new ElementHandle({
                                page: _this._page,
                                id: id,
                                send: _this._send
                            }); })];
                }
            });
        });
    };
    ElementHandle.prototype.click = function (userOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var options, mouseButton, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = __assign({ button: 'left', clickCount: 1 }, userOptions);
                        mouseButton = utils_1.MOUSE_BUTTON[options.button];
                        return [4 /*yield*/, this._scrollIntoView()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._send('Marionette:ActionChain', {
                                chain: [
                                    ['click', this._elementId, mouseButton, options.clickCount]
                                ],
                                nextId: this._actionId
                            }, 'value')];
                    case 2:
                        id = _a.sent();
                        this._actionId = id;
                        return [2 /*return*/];
                }
            });
        });
    };
    ElementHandle.prototype.focus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:ExecuteScript', {
                            'script': 'arguments[0].focus()',
                            args: [this._handleId]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ElementHandle.prototype.hover = function () {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._scrollIntoView()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._send('Marionette:ActionChain', {
                                chain: [
                                    ['move', this._elementId]
                                ],
                                nextId: this._actionId
                            }, 'value')];
                    case 2:
                        id = _a.sent();
                        this._actionId = id;
                        return [2 /*return*/];
                }
            });
        });
    };
    ElementHandle.prototype.press = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!utils_1.hasKey(keys_1["default"], key)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._send('WebDriver:ElementSendKeys', {
                                id: this._elementId,
                                text: keys_1["default"][key]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if (!(key.length === 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._send('WebDriver:ElementSendKeys', {
                                id: this._elementId,
                                text: key
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4: throw new Error("Unknown key: " + key);
                }
            });
        });
    };
    ElementHandle.prototype.screenshot = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var result, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:TakeScreenshot', {
                            id: this._elementId,
                            full: false,
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
    ElementHandle.prototype.type = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:ElementSendKeys', {
                            id: this._elementId,
                            text: text
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ElementHandle;
}(JSHandle_1["default"]));
exports["default"] = ElementHandle;
