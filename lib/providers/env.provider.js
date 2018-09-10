const Provider = require('../Provider');

function map(dest, source, fn) {
    let modifier = fn;
    if(typeof fn !== 'function') {
        modifier = (a) => { a }; 
    }

    for(let i in source) {
        if(typeof source[i] === 'object') {
            if(Array.isArray(source[i])) {
                dest[i] = [];
            } else {
                dest[i] = {};
            }
            map(dest[i], source[i], modifier);
        } else {
            dest[i] = modifier(source[i]);
        }
    }
}

class EnvProvider extends Provider {
    constructor(configMap) {
        super();
        this.configMap = configMap;
        this.config = {};
        this.readEnv();
    }

    readEnv() {
        map(this.config, this.configMap, (envName) => {
            let value = isNaN(+process.env[envName]) ? process.env[envName] : +process.env[envName];
            return value;
        });
    }

    load() {
        return Promise.resolve(this.config);
    }
}

module.exports = EnvProvider;