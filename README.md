# muchconf 
> Wow! So much configuration, so many sources!

1. [What is muchocnf?](##What%20is%20muchconf?)
2. [Getting started](##Getting%20started)  
    2.1 [Promise based approach]()  
    2.2 [Event based approach]()
3. [Loading configuration conditioanly]()
4. [Providers (configuration sources)](##Providers%20\(configuration%20sources\))  
    4.1. [EnvProvider](###EnvProvider)  
    4.2. [ArgvProvider](###ArgvProvider)  
    4.3. [JsonProvider](###JsonProvider)  
    4.4. [JsonFileProvider](###JsonFileProvider)
4. [External providers](##External%20providers)
5. [Writing custom provider]()
6. [Use cases]()  
    6.1 [Multiple configuration sources]()  
    6.2 [Configuration in development and production]()  
    6.3 [Multiple insatces of muchconf]()
-------
## What is muchconf?
Muchconf is a module wchich allows to get configuration for your node.js app. It supports **multiple sources** of configuration and can load different configuration accoring to environment (e.g. development or production) or any custom logic.

Muchconf can reload your application if configuration changes and source supports it.


## Getting started
Install module using your favorite package manager.
```bash
npm install muchconf
```

Configuration will be kept in `Store`. To feed Store with configuration use at least one `Provider` (you can choose from buildin providers or use an external one). 

### Promise based approach:
```js
const { muchconf, EnvProvider } = require('muchconf');

const configStore = muchconf([
    new EnvProvider({
        port: 'PORT',
        ip: 'IP'
    })
]);

configStore
    .load()
    .then((config) => {
        // Now start server and listen on ip and port form environmental variables
        console.log('Server running at ' + config.ip + ':' + confgi.port);
    });
```
### Event based approach:
```js
const { muchconf, EnvProvider } = require('muchconf');

const configStore = muchconf([
    new EnvProvider({
        port: 'PORT',
        ip: 'IP'
    })
]);

configStore.on('loaded', (config) => {
    // Now start server and listen on ip and port form environmental variables
    console.log('Server running at ' + config.ip + ':' + confgi.port);
});

configStore.load();
```
`Store` accepts array of providers. The final configuration is result of combining configurations from each source. A succeeding provider overwrites same keys in preceding one.

Example:
```js
const { Store, JsonProvider } = require('muchconf');

const configStore = new Store([
    new JsonProvider({
        port: '9000',
        ip: '127.0.0.1'
    }),
    new JsonProvider({
        port: '8080'
    })
]);
configStore
    .load()
    .then((config) => {
        // Final configuration:
        /**
         *  {
         *      port: '8080'
         *      ip: '127.0.0.1'
         *  } 
         * 
         **/
    })
```







## Loading configuration conditionaly
Each Provider is aware of configuration of its predecessors. It is possible to load configuration of given Provider based on current state of configuration.

Example:  
Let's say we want run app on diffrent port than default one in production envirnment. In following example the default port will be 3000 and production port will be 8080. In given example the last JsonProvider will overwrie `port` only if `env` will equal 'production'.

```js
const { Store, EnvProvider, JsonProvider } = require('muchconf');

const configStore = new Store([
    new EnvProvider({
        env: 'NODE_ENV',
    }),
    new JsonProvider({
        port: '3000'
    }),
    new JsonProvider({
        port: '8080'
    }, {
        is: {
            env: 'production'
        }
    })
]);
```
Similar effect can be achived wit `not` option. The last Provider will overwrite configuration in every situation except when `env` will equal 'production'.

```js
const { Store, EnvProvider, JsonProvider } = require('muchconf');

const configStore = new Store([
    new EnvProvider({
        env: 'NODE_ENV',
    }),
    new JsonProvider({
        port: '8080'
    }),
    new JsonProvider({
        port: '3000'
    }, {
        not: {
            env: 'production'
        }
    })
]);
```

It is possible to pass a function instead of expected value. The function must return true or false. In next example default port will be overwritten for 'production' or 'testing' environment.

```js
const { Store, EnvProvider, JsonProvider } = require('muchconf');

const configStore = new Store([
    new EnvProvider({
        env: 'NODE_ENV',
    }),
    new JsonProvider({
        port: '3000'
    }),
    new JsonProvider({
        port: '8080'
    }, {
        is: {
            env: (value) => {
                return (value === 'production' || value === 'testing');
            }
        }
    })
]);
```




## muchconf
`muchconf` is a store for configuration. It accepts array of providers and addtional options. Muchconf is `singleton`, which means wherever you require it in your project always will be returend the same instance (multiple instances are also possible - see [multiple muchconf instances]()).

### Syntax:
```js
muchconf(providers, options);
```

### Parameters:
| name                              | type                  | required  | default                   | description                                       |
|-----------------------------------|-----------------------|-----------|---------------------------|---------------------------------------------------|
|`providers`                        | array of Providers    | no        | []                        | Providers of configuration to feed the store      |
| `options`                         | object                | no        | see below                 |   options for muchconf                            |
| `options.instance`                | symbol \| string      | no        | new `Symbol()` is created | Each instance of muchconf is idetified by unique key. By default muchconf creates its key by its self. If more than one instance of muchconf is required it can be created by passing custom `instance` key. The same key must by used later to refer to this instance.
| `options.allowNullOrUndefined`    | boolean               | no        | `false`                   | Should `null` or `undefined` be treated as a proper value. If set to false (default behavior) `null` or `undefined` won't overwrite existing configuration.                                                                                            |

### Returns:
Instance of configuration store. 

### Methods

#### `load` 
Loads configuration from store. I returns promise, wchich resolves to configuration object. 

Syntax:
```js
configStore
    .load()
    .then((config) => {
        // configuration is avalivle here
    });
``` 

#### `get`
Retruns configuration from store.

Syntax:
```js
let config = congiStore.get();
```

#### `getSymbol`
Returns unique key of instance.

Syntax:
```js
configStore.getSymbol();
```

### Events
Muchconf store is an instance of EventEmitter. During its lifecycle couple events are emitted.
| Event name    | Description                                                          |
|---------------|----------------------------------------------------------------------|
| `ready`       | Fired after store initialization and when final configuration is ready. `ready` event is fired only once in store lifecycle.
| `loaded`      | Fired whenever new configuration is ready. It is fired both after store initializan and after configuration update.
| `update`      | Fired after configuration update.
| `error`       | Fired whenever error occures. 


Event cycle:
| state \ event name | ready | loaded | update |
|---------------|:-------:|:--------:|:--------:|
| Instace of muchconf initialaized and configuration is ready | __yes__ | __yes__ | no |
| Configuration has been updated | no | __yes__ | __yes__ |

-----
## Class: Provider
Each configuration provider extends this class. Provider is an instace of EventEmitter.

```js
new Provider(options);
```
### Parameters:
| name         | type     | required  | default          | description                                       |
|--------------|----------|-----------|------------------|---------------------------------------------------|
| `options`      | object   | no        | see below        | options for provider                              |
| `options.castNumbers` | boolean | no | false | if possible, strings will be converted to number, e.g. '2' will be 2 |
| `options.convertTrueFalseStrings` | boolean | no | false | strings like 'true' or 'false' will be converted to boolean |
| `options.cutQuotations` | boolean | no | false | double quotation marks form beggining and ending of string will be cut off. E.g. '"some value"' will be 'some value' |
| `options.not` | object | no | undefined | |
| `options.is` | object | no  | undefined | |

### Writing custom provider
By itself Provider is not very usefull, it will always return empty configuration :). Provider class allows to create custom providers.

The simplest custom provider extends `Provider` class and expose method `load`. Here is an example of provider, which always returns `{ awsome: true }` configuration.

```js
const { Provider } = require('muchconf');

class AwsomeProvider extends Provider {
    constructor(commonOptions) {
        super(commonOptions);
        this.myConfiguration = {
            awsome: true
        };
    }

    load() {
        return Promise.resolve(this.myConfiguration);
    }
}
```
To take advantage of `Provider` parsing function method `parse` must be explicitly called on value. 

```js
const { Provider } = require('muchconf');

class AwsomeProvider extends Provider {
    constructor(commonOptions) {
        super(commonOptions);

        this.myConfiguration = {
            awsome: 'TRUE',
            port: '9000'
        };
    }

    load() {
        let configuration = {};
        for(let key in this.myConfiguration) {
            configuration[key] = this.parse(this.myConfiguration[key]);
        }
        return Promise.resolve(configuration);
    }
}
```
In above example, if AsomeProvider will be called with options `{ castNumber: true, convertTrueFalseStrings: true }` values `'TRUE'` and `'9000'` will be converted to `true` and `9000` accordingly.


_________
## Built in providers (configuration sources)
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

## External providers
Here is list of external providers. 

| Configuration source | Link                           | Description                    |
| -------------------- |--------------------------------| -------------------------------|
| consul               |[kmoskwiak/muchconf-consul-provider](https://github.com/kmoskwiak/muchconf-consul-provider) | Imports configuration from consul KV store. Support for configuration reloading. |





## Writing custom provider