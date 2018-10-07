const events = require('events');
const deepExistsAndEquals = require('./utils/deepExistsAndEquals');

class Provider extends events.EventEmitter {
    constructor(options) {
        super();
        this.defaults = {
           castNumbers: false,
           converTrueFalseStrings: false,
           cutQuotations: false
        };
        this.setOptions(options);
    }

    setOptions(options) {
        options = options || {};
        this.options = { ...this.defaults, ...options };
    }

    parse(data) {
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

    castNumber(data) {
        return isNaN(+data) ? data : +data;
    }

    converTrueFalseString(data) {
        if(data.toLowerCase() === 'true') { return true; }
        if(data.toLowerCase() === 'false') { return false; }
        return data;
    }

    cutQuotations(data) {
        if(data[0] === '"') { data = data.slice(1); }
        if(data[data.length - 1] === '"') { data = data.slice(0, -1); }
        return data;
    }

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