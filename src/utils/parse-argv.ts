function parseArgv(args: string[]) {
    let config: {
        [k: string]: string
    } = {};

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

export default parseArgv;