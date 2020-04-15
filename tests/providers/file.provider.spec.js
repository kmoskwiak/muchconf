const test = require('ava');
const path = require('path');
const { muchFile } = require('../../lib/providers/file.provider');

test('should import config form file', async (t) => {
    const configProvider = muchFile({
        secret: path.resolve(__dirname, '../mocks/docker.secret')
    });

    await configProvider.init();
    const config = await configProvider.load();

    t.deepEqual({
        secret: 'password'
    }, config);
});

test('should import config form file and trim whitespace', async (t) => {
    const configProvider = muchFile({
        secret: path.resolve(__dirname, '../mocks/docker.secret3')
    });

    await configProvider.init();
    const config = await configProvider.load();

    t.deepEqual({
        secret: 'password'
    }, config);
});

test('should import config from file and convert string to number', async (t) => {
    const configProvider = muchFile({
        secret: path.resolve(__dirname, '../mocks/docker.secret2')
    }, {
        castNumbers: true
    });

    await configProvider.init();
    const config = await configProvider.load();

    t.deepEqual({
        secret: 44
    }, config);
});

test('should read filename from env', async (t) => {
    process.env.FILE_PATH = path.resolve(__dirname, '../mocks/docker.secret');

    const configProvider = muchFile({
        secret: 'FILE_PATH'
    }, {
        fromEnv: true
    });
    
    await configProvider.init();
    const config = await configProvider.load();

    t.deepEqual({
        secret: 'password'
    }, config);
});