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
var Provider = require('../Provider');
var JSONprovider = /** @class */ (function (_super) {
    __extends(JSONprovider, _super);
    function JSONprovider(config, options) {
        var _this = _super.call(this, options) || this;
        _this.config = config;
        return _this;
    }
    JSONprovider.prototype.load = function () {
        return Promise.resolve(this.config);
    };
    return JSONprovider;
}(Provider));
/**
 * Configuration from JSON
 * @param {object} config object with configuration
 * @param {Object} [options] common Provider options
 * @param {Boolean} [options.castNumber=false] should strings be converted to number
 * @param {Boolean} [options.converTrueFalseString=false] should true/false strings be converted to boolean
 * @param {Boolean} [options.cutQuotations=false] should trim quotations form strings
 * @param {Boolean} [options.trim=true] trim whitespace from strings
 * @param {Object} [options.not] conditions to not use provider
 * @param {Object} [options.is] condtions to use provider
 */
function muchJson(config, options) {
    return new JSONprovider(config, options);
}
module.exports = {
    JSONprovider: JSONprovider,
    muchJson: muchJson
};
