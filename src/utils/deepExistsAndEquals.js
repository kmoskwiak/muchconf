function deepExistsAndEquals(conditions, data) {
    if(typeof conditions === 'function') {
        return conditions(data);
    }

    let equals = true;
    for(let key in conditions) {

        if(typeof conditions[key] === 'function') {
            equals = equals && deepExistsAndEquals(conditions[key], data[key]);
            continue;
        }

        if(typeof data[key] === undefined || data[key] === null) {
            return false;
        }

        if(typeof conditions[key] !== typeof data[key]) {
            return false;
        }

        if(typeof conditions[key] === 'object') {
            equals = equals && deepExistsAndEquals(conditions[key], data[key]);
            continue;
        }

        if(conditions[key] === data[key]) {
            equals = equals && true;
        } else {
            return false;
        }
    }

    return equals;
}

module.exports = deepExistsAndEquals;