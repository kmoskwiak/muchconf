module.exports = function isObject(value: any) {
    const type = typeof value;
    return type === 'object' && !!value && !Array.isArray(value);
}