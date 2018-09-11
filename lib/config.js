let config = {};

function setConfig(_config) {
    config = _config;
}

function getConfig() {
    return config;
}

module.exports = {
    setConfig: setConfig,
    getConfig: getConfig
};