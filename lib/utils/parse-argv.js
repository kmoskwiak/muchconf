function parseArgv(args) {
    var config = {};
    for (var i in args) {
        if (args[i].startsWith('--')) {
            var parts = args[i].slice(2).split(/=/);
            var key = parts[0];
            var value = parts[1];
            config[key] = value;
        }
    }
    return config;
}
module.exports = parseArgv;
