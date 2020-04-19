module.exports = function isObject(value) {
    const type = typeof value;
    return type === 'object' && !!value && !Array.isArray(value);
}