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
var events = require('events');
var deepExistsAndEquals = require('./utils/deepExistsAndEquals');
var Provider = /** @class */ (function (_super) {
    __extends(Provider, _super);
    /**
     * Creates Provider instance
     * @param {Object} [options] common Provider options
     * @param {Boolean} [options.castNumber=false] should strings be converted to number
     * @param {Boolean} [options.converTrueFalseString=false] should true/false strings be converted to boolean
     * @param {Boolean} [options.cutQuotations=false] should trim quotations form strings
     * @param {Boolean} [options.trim=true] trim whitespace from strings
     * @param {Object} [options.not] conditions to not use provider
     * @param {Object} [options.is] condtions to use provider
     */
    function Provider(options) {
        var _this = _super.call(this) || this;
        _this.defaults = {
            castNumbers: false,
            converTrueFalseStrings: false,
            cutQuotations: false,
            trim: true
        };
        _this.watch = false;
        _this.setOptions(options);
        return _this;
    }
    /**
     * Init provider
     */
    Provider.prototype.init = function () {
        return Promise.resolve();
    };
    /**
     * Sets option either by calling function or returnig value
     * @param {*} option value of option or function which returns value
     * @param {Object} currentConfig current configuration
     * @returns value of option
     */
    Provider.prototype.setOption = function (option, currentConfig) {
        if (typeof option === 'function') {
            return option(currentConfig);
        }
        return option;
    };
    /**
     * Sets options for provider
     * @param {Object} options
     */
    Provider.prototype.setOptions = function (options) {
        options = options || {};
        this.options = __assign(__assign({}, this.defaults), options);
    };
    /**
     * Sets watch property to true.
     */
    Provider.prototype.enableWatching = function () {
        this.watch = true;
    };
    /**
     * Returns watch property
     * @returns watch property
     */
    Provider.prototype.watching = function () {
        return this.watch;
    };
    /**
     * Transforms value
     * @param {*} data value of configuration
     */
    Provider.prototype.parse = function (data) {
        if (typeof data === 'string' && this.options.trim) {
            data = this.trim(data);
        }
        if (typeof data === 'string' && this.options.castNumbers) {
            data = this.castNumber(data);
        }
        if (typeof data === 'string' && this.options.converTrueFalseStrings) {
            data = this.converTrueFalseString(data);
        }
        if (typeof data === 'string' && this.options.cutQuotations) {
            data = this.cutQuotations(data);
        }
        return data;
    };
    /**
     * Converts numberlike strings to numbers
     * @param {String} data string to convert
     * @returns converted number or string if convertion was not possible
     */
    Provider.prototype.castNumber = function (data) {
        return isNaN(+data) ? data : +data;
    };
    /**
     * Converts 'true' and 'false' to boolean
     * @param {String} data string to convert
     * @returns converted value or original one if converion was not possible
     */
    Provider.prototype.converTrueFalseString = function (data) {
        if (data.toLowerCase() === 'true') {
            return true;
        }
        if (data.toLowerCase() === 'false') {
            return false;
        }
        return data;
    };
    /**
     * Trims quotations from strings
     * @param {String} data string to convert
     * @returns converted value or original one if converion was not possible
     */
    Provider.prototype.cutQuotations = function (data) {
        if (data[0] === '"') {
            data = data.slice(1);
        }
        if (data[data.length - 1] === '"') {
            data = data.slice(0, -1);
        }
        return data;
    };
    /**
     * Trims white characters from strings
     * @param {String} data string to convert
     * @returns converted value or original one if converion was not possible
     */
    Provider.prototype.trim = function (data) {
        return data.trim();
    };
    /**
     * Loads configuration. This method should be implemented in custom provider.
     * @returns Promise wchich resolves to empty configuration
     */
    Provider.prototype.load = function () {
        return Promise.resolve({});
    };
    /**
     * Loads Provider configuration according to condtions passed to options.is and options.not
     * @param {Object} currentConfiguration current configuration in muchconf store
     * @returns Promise
     */
    Provider.prototype.loadConfiguration = function (currentConfiguration) {
        var loadConfig = true;
        if (!this.options.is && !this.options.not) {
            return this.load();
        }
        if (this.options.not) {
            loadConfig = !deepExistsAndEquals(this.options.not, currentConfiguration);
        }
        if (this.options.is) {
            loadConfig = loadConfig && deepExistsAndEquals(this.options.is, currentConfiguration);
        }
        if (loadConfig) {
            return this.load();
        }
        return Promise.resolve({});
    };
    return Provider;
}(events.EventEmitter));
module.exports = Provider;
