const test = require('ava');
const { muchEnv } = require('../../lib/providers/env.provider');

test.before((t) => {
    // Set ENV variables
    process.env._test_mongoUri = 'mongo://localhost';
    process.env._test_active = true;
    process.env._test_number = 44;
    process.env._test_mongoSecret = 'secret';
    process.env._test_APP_NAME = 'test_app';
});

test('should import env variables', async (t) => {
    let envConfig = muchEnv({
        mongoUri: '_test_mongoUri'
    });
    await envConfig.init();
    let config = await envConfig.load();

    t.deepEqual(config, {
        mongoUri: 'mongo://localhost'
    });
});

test('should import number as a number', async (t) => {
    let envConfig = muchEnv({
        number: '_test_number'
    });
    await envConfig.init();
    let config = await envConfig.load();

    t.deepEqual(config, {
        number: 44
    });
});

test('should import env variables into deep object', async (t) => {
    let envConfig = muchEnv({
        mongo: {
            uri: '_test_mongoUri',
            secret: '_test_mongoSecret',
            options: {
                number: '_test_number'
            }
        }
    });
    await envConfig.init();
    let config = await envConfig.load();

    t.deepEqual(config, {
        mongo: {
            uri: 'mongo://localhost',
            secret: 'secret',
            options: {
                number: 44
            }
        }
    });
});

test('should import env variables into array', async (t) => {
    let envConfig = muchEnv({
        mongo: ['_test_mongoUri', '_test_mongoSecret', {
            number: '_test_number'
        }]
    });
    await envConfig.init();
    let config = await envConfig.load();

    t.deepEqual(config, {
        mongo: ['mongo://localhost', 'secret', {
            number: 44
        }]
    });
});