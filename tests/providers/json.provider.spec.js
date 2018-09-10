const test = require('ava');
const JSONprovider = require('../../lib/providers/json.provider');

test('should return json configuration', async (t) => {
    const jsonProvider = new JSONprovider({
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