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
exports.__esModule = true;
var events_1 = require("events");
var utils_1 = require("../utils");
var cache = new Map();
var JSHandle = /** @class */ (function (_super) {
    __extends(JSHandle, _super);
    function JSHandle(params) {
        var _this = _super.call(this) || this;
        _this._handleId = params.id;
        _this._elementId = utils_1.getElementId(params.id);
        if (cache.has(_this._elementId)) {
            return cache.get(_this._elementId);
        }
        cache.set(_this._elementId, _this);
        params.page.on('close', function () {
            cache.clear();
        });
        return _this;
    }
    return JSHandle;
}(events_1["default"]));
exports["default"] = JSHandle;
