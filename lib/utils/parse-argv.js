function parseArgv(args) {
    let config = {};

    for(let i in args) {
        if(args[i].startsWith('--')) {
            let parts = args[i].slice(2).split(/=/);
            let key = parts[0];
            let value = parts[1];

            config[key] = value;
        }
    }

    return config;
}

module.exports = parseArgv;