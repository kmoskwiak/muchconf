const test = require('ava');
const map = require('../../lib/utils/map');

test('should fill object accoring to map', async (t) => {
    let config = {};

    const source = {
        a: 1,
        b: 2,
        c: 3
    };

    await map(config, {
        a: 'a',
        b: 'b',
        c: 'a',
        d: {
            a: 'a',
            b: ['a', 'b', 'c']
        }
    }, (name) => {
        return source[name];
    });

    t.deepEqual(config, {
        a: 1,
        b: 2,
        c: 1,
        d: {
            a: 1,
            b: [1, 2, 3]
        }
    });

});