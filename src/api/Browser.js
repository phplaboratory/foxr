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
var Page_1 = require("./Page");
var Browser = /** @class */ (function (_super) {
    __extends(Browser, _super);
    function Browser(arg) {
        var _this = _super.call(this) || this;
        _this._send = arg.send;
        return _this;
    }
    Browser.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('Marionette:AcceptConnections', { value: false })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._send('Marionette:Quit')];
                    case 2:
                        _a.sent();
                        this.emit('disconnected');
                        return [2 /*return*/];
                }
            });
        });
    };
    Browser.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:DeleteSession')];
                    case 1:
                        _a.sent();
                        this.emit('disconnected');
                        return [2 /*return*/];
                }
            });
        });
    };
    Browser.prototype.newPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pages, newPageId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:ExecuteScript', {
                            script: 'window.open()'
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._send('WebDriver:GetWindowHandles')];
                    case 2:
                        pages = _a.sent();
                        newPageId = pages[pages.length - 1];
                        return [4 /*yield*/, this._send('WebDriver:SwitchToWindow', {
                                name: newPageId,
                                focus: true
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, new Page_1["default"]({
                                browser: this,
                                id: newPageId,
                                send: this._send
                            })];
                }
            });
        });
    };
    Browser.prototype.pages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ids;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._send('WebDriver:GetWindowHandles')];
                    case 1:
                        ids = _a.sent();
                        return [2 /*return*/, ids.map(function (id) { return new Page_1["default"]({
                                browser: _this,
                                id: id,
                                send: _this._send
                            }); })];
                }
            });
        });
    };
    return Browser;
}(events_1["default"]));
exports["default"] = Browser;
