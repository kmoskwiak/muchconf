const test = require('ava');
const JSONfileProvider = require('../../lib/providers/json-file.provider');
const path = require('path');

const jsonConfigFilePath = path.resolve(__dirname, '../mocks/config.json');
const jsConfigFilePath = path.resolve(__dirname, '../mocks/config.js');

test('should import config form json file', async (t) => {
    const configProvider = new JSONfileProvider(jsonConfigFilePath);
    
    configProvider.init();
    const config = await configProvider.load();

    t.deepEqual(config, {
        mongo: {
            uri: 'mongo://localhost',
            dbName: 'data'
        },
        active: true,
        appName: 'testApp',
        number: 44
    });
});

test('should import config form json file', async (t) => {
    const configProvider = new JSONfileProvider(jsConfigFilePath);

    configProvider.init();
    const config = await configProvider.load();

    t.deepEqual(config, {
        mongo: {
            uri: 'mongo://localhost',
            database: 'test'
        },
        active: true,
        number: 44
    });
});

test('should throw', async (t) => {
    const configProvider = new JSONfileProvider(jsConfigFilePath + 'non_existing_path');

    t.throws(() => { 
        configProvider.init()
    });

});