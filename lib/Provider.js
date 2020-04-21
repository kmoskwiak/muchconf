const events = require('events');
const deepExistsAndEquals = require('./utils/deepExistsAndEquals');

class Provider extends events.EventEmitter {
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
    constructor(options) {
        super();
        this.defaults = {
           castNumbers: false,
           converTrueFalseStrings: false,
           cutQuotations: false,
           trim: true
        };
        this.watch = false;
        this.setOptions(options);
    }

    /**
     * Init provider
     */
    init() {
        return Promise.resolve();
    }

    /**
     * Sets option either by calling function or returnig value
     * @param {*} option value of option or function which returns value
     * @param {Object} currentConfig current configuration
     * @returns value of option
     */
    setOption(option, currentConfig) {
        if(typeof option === 'function') {
            return option(currentConfig);
        }
        return option;
    }

    /**
     * Sets options for provider
     * @param {Object} options 
     */
    setOptions(options) {
        options = options || {};
        this.options = { ...this.defaults, ...options };
    }

    /**
     * Sets watch property to true.
     */
    enableWatching() {
        this.watch = true;
    }

    /**
     * Returns watch property
     * @returns watch property
     */
    watching() {
        return this.watch;
    }

    /**
     * Transforms value
     * @param {*} data value of configuration
     */
    parse(data) {
        if(typeof data === 'string' && this.options.trim) {
            data = this.trim(data);
        }
        if(typeof data === 'string' && this.options.castNumbers) {
            data = this.castNumber(data);
        }
        if(typeof data === 'string' && this.options.converTrueFalseStrings) {
            data = this.converTrueFalseString(data);
        }
        if(typeof data === 'string' && this.options.cutQuotations) {
            data = this.cutQuotations(data);
        }
        return data;
    }
    
    /**
     * Converts numberlike strings to numbers
     * @param {String} data string to convert
     * @returns converted number or string if convertion was not possible
     */
    castNumber(data) {
        if(isNaN(+data) || isNaN(parseInt(data))) {
            return data;
        }
        return +data;
    }

    /**
     * Converts 'true' and 'false' to boolean
     * @param {String} data string to convert
     * @returns converted value or original one if converion was not possible
     */
    converTrueFalseString(data) {
        if(data.toLowerCase() === 'true') { return true; }
        if(data.toLowerCase() === 'false') { return false; }
        return data;
    }

    /**
     * Trims quotations from strings
     * @param {String} data string to convert
     * @returns converted value or original one if converion was not possible
     */
    cutQuotations(data) {
        if(data[0] === '"') { data = data.slice(1); }
        if(data[data.length - 1] === '"') { data = data.slice(0, -1); }
        return data;
    }

    /**
     * Trims white characters from strings
     * @param {String} data string to convert
     * @returns converted value or original one if converion was not possible
     */
    trim(data) {
        return data.trim();
    }

    /**
     * Loads configuration. This method should be implemented in custom provider. 
     * @returns Promise wchich resolves to empty configuration
     */
    load() {
        return Promise.resolve({});
    }

    /**
     * Loads Provider configuration according to condtions passed to options.is and options.not
     * @param {Object} currentConfiguration current configuration in muchconf store
     * @returns Promise
     */
    loadConfiguration(currentConfiguration) {
        let loadConfig = true;

        if(!this.options.is && !this.options.not) {
            return this.load();
        }

        if(this.options.not) {
            loadConfig = !deepExistsAndEquals(this.options.not, currentConfiguration);
        }

        if(this.options.is) {
            loadConfig = loadConfig && deepExistsAndEquals(this.options.is, currentConfiguration);
        }

        if(loadConfig) {
            return this.load();
        }

        return Promise.resolve({});
    }
}

module.exports = Provider;