module.exports = (Provider) => {
    return (...args) => {
        return new Provider(...args);
    };
}