const test = require('ava');
const {
    Store, 
    ArgvProvider,
    EnvProvidder,
    JsonFileProvider,
    JsonProvider
} = require('../index');

test('should return always the same instance', async (t) => {
    const configStore_1 = new Store([]);
    const configStore_2 = new Store([]);
    t.is(configStore_1.getSymbol(), configStore_2.getSymbol());
});

test('should return different instances of store', async (t) => {
    const configStore_1 = new Store([]);
    const configStore_2 = new Store([], Symbol());

    t.not(configStore_1.getSymbol(), configStore_2.getSymbol());
});

test('should load configuration from json provider', async (t) => {
    const configStore = new Store([
        new JsonProvider({
            name: 'test',
            p1: 1,
            p2: 2,
            p3: [1,2,3]
        })
    ], Symbol());

    let config = await configStore.load();

    t.deepEqual(config, {
        name: 'test',
        p1: 1,
        p2: 2,
        p3: [1,2,3]
    });

});