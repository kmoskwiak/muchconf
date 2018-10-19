# muchconf

## Main features
- 4 buildin sources of configuration (env, argv, json and json file) and support for external providers,
- supports configuration reloading,

## Getting started
Install package:
```bash
npm install muchconf
```
_________
## Providers (configuration sources)
Provider represents source of configuration. Muchconf has 4 buildin providers and supports external providers. Out of the box muchconf can get configuration form environmental variables, command line arguments, JSON or JSON file.

Buildin providers:
1) [EnvProvider](###EnvProvider) - environmental variables
2) [ArgvProvider](###ArgvProvider) - command line arguments
3) [JsonProvider](###JsonProvider) - JSON (or javascript object)
4) [JsonFileProvider](###JsonFileProvider) - JSON file

### EnvProvider
EnvProvider gets configuration form environmental varialbes in OS.

#### Syntax
```js
new EnvProvider(configurationMap, providerOptions)
```
#### Parameters
`configurationMap` _{object}_ object representing configuration. It could be nested or include arrays. Each value will be replaced with value of ENV variable with that name.

`providerOptions` {object} ___optional___ common options for provider. See [Provider](##Provider) section

Example:
```js
const { Store, EnvProvider } = require('muchconf');

const configStore = new Store([
    new EnvProvider({
        env: 'NODE_ENV',
        port: 'PORT',
        mongo: {
            uri: 'MONGO_URI',
            port: 'MONGO_PORT',
            dbName: 'MONGO_DATABASE_NAME'
        },
        apiEndpoints: ['API_ENDPOINT_MAIN', 'API_ENDPOINT_BACKUP']
    })
]);
```
EnvProvider will map environmental variables to configuration keys. Final configuration could look like this:
```js
    {
        env: 'production',
        port: '9000',
        mongo: {
            uri: 'mongo://localhost',
            port: '27017',
            dbName: 'AppDatabase'
        },
        apiEndpoints: ['https://main.api.example', 'https://backup.api.example']
    }
```
#### ArgvProvider
ArgvProvider gets configuration from command line arguments in format `--name-of-option <value>`.
#### Syntax
```js
new ArgvProvider(configurationMap, providerOptions)
```
#### Parameters
`configurationMap` _{object}_ object representing configuration. It could be nested or include arrays. Each value will be replaced with value of option with that name preceded with double dash.

`providerOptions` {object} ___optional___ common options for provider. See [Provider](##Provider) section

Example:
```js
const { Store, ArgvProvider } = require('muchconf');

const configStore = new Store([
    new ArgvProvider({
        env: 'env',
        port: 'port',
        mongo: {
            uri: 'mongo-uri',
            port: 'mongo-port'
        }
    })
]);
```
If we run app with command like this:
```bash
node app.js --env production --port 9000 --mongo-uri mongo://localhost --mongo-port 27017
```
It will result with configuration:
```js
    {
        env: 'production',
        port: '9000',
        mongo: {
            uri: 'mongo://localhost',
            port: '27017'
        },
    }
```

#### JsonProvider
JsonProvider accepts JSON or JS object as configuration

#### Syntax
```js
new JsonProvider(json, providerOptions)
```
#### Parameters
`json` _{object}_ object with configuration

`providerOptions` {object} ___optional___ common options for provider. See [Provider](##Provider) section

Example:
```js
const { Store, JsonProvider } = require('muchconf');

const configStore = new Store([
    new JsonProvider({
        env: 'production',
        port: 9000,
        mongo: {
            uri: 'mongo://localhost',
            port: 27017
        }
    })
]);
```

#### JsonFileProvider
JsonFileProvider will import JSON or JS file with configuration. 

#### Syntax
```js
new JsonFileProvider(filePath, providerOptions)
```
#### Parameters
`filePath` _{string}_ path to file with configuration

`providerOptions` {object} ___optional___ common options for provider. See [Provider](##Provider) section

Example:
```js
const { Store, JsonFileProvider } = require('muchconf');

const configStore = new Store([
    new JsonProvider('/app/config/configuration.json')
]);
```

### External providers

## Writing custom provider