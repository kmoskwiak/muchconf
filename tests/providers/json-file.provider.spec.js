const test = require('ava');
const { muchJsonFile } = require('../../lib/providers/json-file.provider');
const path = require('path');

const jsonConfigFilePath = path.resolve(__dirname, '../mocks/config.json');
const jsConfigFilePath = path.resolve(__dirname, '../mocks/config.js');

test('should import config form json file', async (t) => {
    const configProvider = muchJsonFile(jsonConfigFilePath);
    
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

test('should import config form js file', async (t) => {
    const configProvider = muchJsonFile(jsConfigFilePath);

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

test('should not import config if filepath is not provided', async (t) => {
    const configProvider = muchJsonFile();

    configProvider.init();
    const config = await configProvider.load();

    t.deepEqual(config, {});
});