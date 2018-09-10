const events = require('events');

class Provider extends events.EventEmitter {
    constructor(options) {
        super();
        this.defaults = {
           castNumbers: false,
           converTrueFalseStrings: false 
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
}

module.exports = Provider;