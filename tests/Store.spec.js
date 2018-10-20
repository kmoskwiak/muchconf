const test = require('ava');
const UpdatingProvider = require('./mocks/updating-provider.mock');
const {
    muchconf, 
    ArgvProvider,
    EnvProvidder,
    JsonFileProvider,
    JsonProvider
} = require('../index');

test('should return always the same instance', async (t) => {
    const configStore_1 = muchconf();
    const configStore_2 = muchconf();
    t.is(configStore_1.getSymbol(), configStore_2.getSymbol());
});

test('should return different instances of store', async (t) => {
    const configStore_1 = muchconf();
    const configStore_2 = muchconf([], { instance: Symbol() });

    t.not(configStore_1.getSymbol(), configStore_2.getSymbol());
});

test('should load configuration from json provider', async (t) => {
    const configStore = muchconf([
        new JsonProvider({
            name: 'test',
            p1: 1,
            p2: 2,
            p3: [1,2,3]
        })
    ], { instance: Symbol() });

    let config = await configStore.load();

    t.deepEqual(config, {
        name: 'test',
        p1: 1,
        p2: 2,
        p3: [1,2,3]
    });
});

test('should merge configuration form sources but not overwrite with null or undefined', async (t) => {
    const configStore = muchconf([
        new JsonProvider({
            a: 1,
            b: 2
        }),
        new JsonProvider({
            a: null,
            b: undefined
        })
    ], { instance: Symbol() });

    let config = await configStore.load();

    t.deepEqual(config, {
        a: 1,
        b: 2
    });
});

test('should merge configuration form sources and overwrite with null or undefined', async (t) => {
    const configStore = muchconf([
        new JsonProvider({
            a: 1,
            b: 2
        }),
        new JsonProvider({
            a: null,
            b: undefined
        })
    ], { 
        instance: Symbol(),
        allowFalsy: true
    });

    let config = await configStore.load();

    t.deepEqual(config, {
        a: null,
        b: undefined
    });
});

test('should load and merge configuration from json providers', async (t) => {
    const configStore = muchconf([
        new JsonProvider({
            name: 'config_1',
            p1: 1,
            p2: 2,
            p3: [1,2,3]
        }),
        new JsonProvider({
            name: 'config_2',
            p2: 3,
            p3: [5,6]
        })
    ], { instance: Symbol() });

    let config = await configStore.load();

    t.deepEqual(config, {
        name: 'config_2',
        p1: 1,
        p2: 3,
        p3: [5,6]
    });
});

test('should load and merge configuration from json providers and omit configuration if condition not met', async (t) => {
    const configStore = muchconf([
        new JsonProvider({
            name: 'config_1',
            p1: 1,
            p2: 2,
            p3: [1,2,3]
        }),
        new JsonProvider({
            name: 'config_2',
            p2: 3,
            p3: [5,6]
        }),
        new JsonProvider({
            name: 'config_3',
            p2: 5,
            p3: [5,6]
        }, {
            is: {
                p1: 4
            }
        })
    ], { instance: Symbol() });

    let config = await configStore.load();

    t.deepEqual(config, {
        name: 'config_2',
        p1: 1,
        p2: 3,
        p3: [5,6]
    });
});


test('should load and merge configuration from json providers and omit configuration if condition not met', async (t) => {
    const configStore = muchconf([
        new JsonProvider({
            name: 'config_1',
            p1: 1,
            p2: 2,
            p3: [1,2,3]
        }),
        new JsonProvider({
            name: 'config_2',
            p2: 3,
            p3: [5,6]
        }),
        new JsonProvider({
            name: 'config_3',
            p2: 5,
            p3: [5,6]
        }, {
            not: {
                p1: 1
            }
        })
    ], { instance: Symbol() });

    let config = await configStore.load();

    t.deepEqual(config, {
        name: 'config_2',
        p1: 1,
        p2: 3,
        p3: [5,6]
    });
});

test('should realod configuration if provider updates', async (t) => {
    let resolver;
    let wait = new Promise((resolve) => {
        resolver = resolve;
    });
    const configStore = muchconf([
        new UpdatingProvider()
    ], { instance: Symbol() });

    let config = {};

    configStore.on('update', async () => {
        config = await configStore.load();
        resolver();
    });

    await configStore.load();
    await wait;

    t.deepEqual(config, {
        a: 4,
        b: 2,
        c: 3,
        d: 5
    });

});