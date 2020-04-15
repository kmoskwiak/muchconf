const test = require('ava');
const { muchJson } = require('../../lib/providers/json.provider');

test('should return json configuration', async (t) => {
    const jsonProvider = muchJson({
        mongoUri: 'mongo://localhost',
        user: {
            name: 'Finn',
            powers: 44
        }
    }); 

    const config = await jsonProvider.load();

    t.deepEqual(config, {
        mongoUri: 'mongo://localhost',
        user: {
            name: 'Finn',
            powers: 44
        }
    });
});