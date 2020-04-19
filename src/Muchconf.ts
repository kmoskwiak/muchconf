import { EventEmitter } from 'events';
let mainInstanceSymbol = null;
const instances = {};
const isObject = require('./utils/isObject');

class Muchconf extends EventEmitter {
    /**
     * Creates configuration store
     * @param {Provider[]} [providers=[]]
     * @param {Object} [options]
     * @param {Symbol | String} [options.instance=Symbol()]
     * @param {Boolean} [options.allowNullOrUndefined=false]
     */
    constructor(providers = [], options = {}) {
        if(!Array.isArray(providers)) {
            options = providers
            providers = [];
        }

        let instance = options.instance;
        if(!instance && mainInstanceSymbol) { return instances[mainInstanceSymbol]; }
        if(!instance && instances[instance]) { return instances[instance]; }
        
        super();

        if(!instance) {
            mainInstanceSymbol = this.symbol = Symbol('main_instance');
            instances[mainInstanceSymbol] = this;
        } else {
            this.symbol = instance;
            instances[instance] = this;
        }

        this.options = options;
        this.config = {};
        this.rawConfig = [];
        this.providers = providers;
        this.emittedEvents = {}; 
        this.configResolver = this.loadConfiguration();
    }

    /**
     * Merges configuration objects
     * @param {Object} obj object to merge into configuration
     * @returns merged configuration object 
     */
    merge(obj) {
        let config = Object.assign({}, this.config);
        for(let key in obj) {
            if(this.options.allowNullOrUndefined) {
                config[key] = obj[key];
            } else {
                if(typeof obj[key] === 'undefined' || obj[key] === null) {
                    config[key] = config[key];
                } else if(isObject(obj[key]) && isObject(config[key])) {
                    config[key] = Object.assign({}, config[key], obj[key]);
                } else {
                    config[key] = obj[key];
                }
            }
        }
        return config;
    }

    /**
     * Loads provider configuration
     * @returns Promise
     */
    async loadConfiguration() {
        for(let i in this.providers) {
            let provider = this.providers[i];
            await provider.init(this.config);
            let providerConfig = await provider.loadConfiguration(this.config);
            this.rawConfig.push(providerConfig)

            if(provider.watching()) {
                provider.on('update', () => {
                    this.updateConfiguration(i);
                });
            }

            this.config = this.merge(providerConfig);
        }
        return this.config;

    }

    /**
     * Updates final configuration
     * @param {Number} index index of configuration in array
     * @fires Muchconf#update
     * @fires Muchconf#loaded
     */
    async updateConfiguration(index) {
        let tempConfig = {};
        for(let i in this.rawConfig) {
            if(i === index) {
                await this.providers[i].init(tempConfig);
                this.rawConfig[i] = await this.providers[i].loadConfiguration(tempConfig);
            }
            tempConfig = Object.assign({}, tempConfig, this.rawConfig[i]);
        }

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
    }

    /**
     * Load configuration
     * @fires Muchconf#loaded
     * @fires Muchconf#ready
     * @returns Promise with configuration
     */
    async load() {
        try {
            await this.configResolver;
        } catch(err) {
            this.emit('error', err);
            throw err;
        }

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
        return this.config;        
    }

    /**
     * Emits event only once
     * @param {String} eventName 
     */
    emitOnce(eventName) {
        if(!this.emittedEvents[eventName]) {
            this.emittedEvents[eventName] = true;
            this.emit(eventName);
        }
    }

    /**
     * Get configuration
     * @returns configuration
     */
    get() {
        return this.config;
    }

    /**
     * Get instance key (symbol)
     * @returns instance unique key
     */
    getSymbol() {
        return this.symbol;
    }

    /**
     * Listen for provider events
     * @param {Provider} provider 
     */
    watchProvider(provider) {
        provider.on('loaded', async () => {
            await this.loadConfiguration()
        });
    }
}

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