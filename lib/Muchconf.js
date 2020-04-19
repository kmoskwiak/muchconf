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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var events = require('events');
var mainInstanceSymbol = null;
var instances = {};
var isObject = require('./utils/isObject');
var Muchconf = /** @class */ (function (_super) {
    __extends(Muchconf, _super);
    /**
     * Creates configuration store
     * @param {Provider[]} [providers=[]]
     * @param {Object} [options]
     * @param {Symbol | String} [options.instance=Symbol()]
     * @param {Boolean} [options.allowNullOrUndefined=false]
     */
    function Muchconf(providers, options) {
        if (providers === void 0) { providers = []; }
        if (options === void 0) { options = {}; }
        var _this = this;
        if (!Array.isArray(providers)) {
            options = providers;
            providers = [];
        }
        var instance = options.instance;
        if (!instance && mainInstanceSymbol) {
            return instances[mainInstanceSymbol];
        }
        if (!instance && instances[instance]) {
            return instances[instance];
        }
        _this = _super.call(this) || this;
        if (!instance) {
            mainInstanceSymbol = _this.symbol = Symbol('main_instance');
            instances[mainInstanceSymbol] = _this;
        }
        else {
            _this.symbol = instance;
            instances[instance] = _this;
        }
        _this.options = options;
        _this.config = {};
        _this.rawConfig = [];
        _this.providers = providers;
        _this.emittedEvents = {};
        _this.configResolver = _this.loadConfiguration();
        return _this;
    }
    /**
     * Merges configuration objects
     * @param {Object} obj object to merge into configuration
     * @returns merged configuration object
     */
    Muchconf.prototype.merge = function (obj) {
        var config = Object.assign({}, this.config);
        for (var key in obj) {
            if (this.options.allowNullOrUndefined) {
                config[key] = obj[key];
            }
            else {
                if (typeof obj[key] === 'undefined' || obj[key] === null) {
                    config[key] = config[key];
                }
                else if (isObject(obj[key]) && isObject(config[key])) {
                    config[key] = Object.assign({}, config[key], obj[key]);
                }
                else {
                    config[key] = obj[key];
                }
            }
        }
        return config;
    };
    /**
     * Loads provider configuration
     * @returns Promise
     */
    Muchconf.prototype.loadConfiguration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, _a, _b, _i, i;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _loop_1 = function (i) {
                            var provider, providerConfig;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        provider = this_1.providers[i];
                                        return [4 /*yield*/, provider.init(this_1.config)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, provider.loadConfiguration(this_1.config)];
                                    case 2:
                                        providerConfig = _a.sent();
                                        this_1.rawConfig.push(providerConfig);
                                        if (provider.watching()) {
                                            provider.on('update', function () {
                                                _this.updateConfiguration(i);
                                            });
                                        }
                                        this_1.config = this_1.merge(providerConfig);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a = [];
                        for (_b in this.providers)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        i = _a[_i];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, this.config];
                }
            });
        });
    };
    /**
     * Updates final configuration
     * @param {Number} index index of configuration in array
     * @fires Muchconf#update
     * @fires Muchconf#loaded
     */
    Muchconf.prototype.updateConfiguration = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var tempConfig, _a, _b, _i, i, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        tempConfig = {};
                        _a = [];
                        for (_b in this.rawConfig)
                            _a.push(_b);
                        _i = 0;
                        _e.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        i = _a[_i];
                        if (!(i === index)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.providers[i].init(tempConfig)];
                    case 2:
                        _e.sent();
                        _c = this.rawConfig;
                        _d = i;
                        return [4 /*yield*/, this.providers[i].loadConfiguration(tempConfig)];
                    case 3:
                        _c[_d] = _e.sent();
                        _e.label = 4;
                    case 4:
                        tempConfig = Object.assign({}, tempConfig, this.rawConfig[i]);
                        _e.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        this.config = Object.assign({}, tempConfig);
                        /**
                         * Update event
                         * @event Muchconf#update
                         */
                        this.emit('update');
                        /**
                         * Loaded event
                         * @event Muchconf#loaded
                         */
                        this.emit('loaded');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load configuration
     * @fires Muchconf#loaded
     * @fires Muchconf#ready
     * @returns Promise with configuration
     */
    Muchconf.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configResolver];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        this.emit('error', err_1);
                        throw err_1;
                    case 3:
                        /**
                         * Loaded event
                         * @event Muchconf#loaded
                         */
                        this.emitOnce('loaded');
                        /**
                         * Ready event
                         * @event Muchconf#ready
                         */
                        this.emitOnce('ready');
                        return [2 /*return*/, this.config];
                }
            });
        });
    };
    /**
     * Emits event only once
     * @param {String} eventName
     */
    Muchconf.prototype.emitOnce = function (eventName) {
        if (!this.emittedEvents[eventName]) {
            this.emittedEvents[eventName] = true;
            this.emit(eventName);
        }
    };
    /**
     * Get configuration
     * @returns configuration
     */
    Muchconf.prototype.get = function () {
        return this.config;
    };
    /**
     * Get instance key (symbol)
     * @returns instance unique key
     */
    Muchconf.prototype.getSymbol = function () {
        return this.symbol;
    };
    /**
     * Listen for provider events
     * @param {Provider} provider
     */
    Muchconf.prototype.watchProvider = function (provider) {
        var _this = this;
        provider.on('loaded', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadConfiguration()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return Muchconf;
}(events.EventEmitter));
/**
 * Create or return instance of Muchconf
 * @param {Provider[]} [providers=[]]
 * @param {Object} [options]
 * @param {Symbol | String} [options.instance=Symbol()]
 * @param {Boolean} [options.allowNullOrUndefined=false]
 * @returns Muchconf instace
 */
function muchconf(providers, options) {
    return new Muchconf(providers, options);
}
module.exports = muchconf;
