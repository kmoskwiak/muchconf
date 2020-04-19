async function map(dest: any, source: any, fn: any) {
    let modifier = fn;
    if(typeof fn !== 'function') {
        modifier = (a: any) => { a }; 
    }

    for(let i in source) {
        if(typeof source[i] === 'object') {
            if(Array.isArray(source[i])) {
                dest[i] = [];
            } else {
                dest[i] = {};
            }
            await map(dest[i], source[i], modifier);
        } else {
            dest[i] = await modifier(source[i]);
        }
    }
}

module.exports = map;