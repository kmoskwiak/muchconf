const { muchconf, JsonProvider, EnvProvider } = require('../../index');

const configStore = muchconf([
    new JsonProvider({
        port: 9000,
        ip: '127.0.0.1'
    }),
    new EnvProvider({
        port: 'PORT',
        ip: 'IP'
    })
]);

configStore.on('ready', () => {
    require('./server');
});

configStore.load();