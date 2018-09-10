const test = require('ava');
const ArgvProvider = require('../../lib/providers/argv.provider');

test('should map and import config', async(t) => {
    const argvProvider = new ArgvProvider({
        mongoUri: 'mongo-uri'
    });

    argvProvider.readArgv(['--mongo-uri="mongo://localhost"']);

    let config = await argvProvider.load();

    t.deepEqual(config, {
        mongoUri: 'mongo://localhost'
    });
}); 