# muchconf
> Wow! So much configuration, so many sources!

1. [What is muchconf?](#What%20is%20muchconf?)
2. [Getting started](#Getting%20started)  
    2.1. [Promise based approach](#Promise%20based%20approach:)  
    2.2. [Event based approach](#Event%20based%20approach)  
    2.3. [Initializing muchconf with multiple sources](#Initializing%20muchconf%20with%20multiple%20sources)  
    2.4. [Loading configuration conditionally](#Loading%20configuration%20conditionally)  
    2.5. [Multiple instances of muchconf](#Multiple%20instances%20of%20muchconf)
3. [muchconf()](#muchconf\(\))
4. [Class: Provider](#Class:%20Provider)  
5. [Built in providers (configuration sources)](#Built%20in%20providers%20\(configuration%20sources\))  
    5.1. [EnvProvider](#EnvProvider)  
    5.2. [ArgvProvider](#ArgvProvider)  
    5.3. [JsonProvider](#JsonProvider)  
    5.4. [JsonFileProvider](#JsonFileProvider)
6. [External providers](#External%20providers)
7. [Writing custom provider](#Writing%20custom%20provider)
8. [Examples](#Examples)


## What is muchconf?
Muchconf is a module which allows to get configuration for your NodeJS app. It supports **multiple sources** of configuration and can load different configuration according to environment (e.g. development or production) or any custom logic.

Out of the box muchconf supports 4 sources of configuration: environmental variables, command line arguments, json and json (js) files. Additional sources can be added using [external providers](#External%20providers).

Muchconf can reload your application if configuration changes and source supports it.

## Getting started
Install module using your favorite package manager.
```bash
npm install muchconf
```
Configuration will be kept in `Store`. To feed Store with configuration use at least one `Provider` (you can choose from built in providers or use an external one). 

### Promise based approach
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
### Event based approach
```js
const { muchconf, EnvProvider } = require('muchconf');

const configStore = muchconf([
    new EnvProvider({
        port: 'PORT',
        ip: 'IP'
    })
]);

configStore.on('ready', (config) => {
    // Now start server and listen on ip and port form environmental variables
    console.log('Server running at ' + config.ip + ':' + confgi.port);
});

configStore.load();
```

### Initializing muchconf with multiple sources
`muchconf` accepts array of providers. The final configuration is result of combining configurations from each source. A succeeding provider overwrites same keys in preceding one.

__Example:__

```js
const { muchconf, JsonProvider } = require('muchconf');

const configStore = muchconf([
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
    });
```

### Loading configuration conditionally
Each Provider is aware of configuration of its predecessors. It is possible to load configuration of given Provider based on current state of configuration.

__Example:__

Let's say we want run app on different port than default one in production environment. In following example the default port will be 3000 and production port will be 8080. In given example the last JsonProvider will overwrite `port` only if `env` will equal 'production'.

```js
const { muchconf, EnvProvider, JsonProvider } = require('muchconf');

const configStore = muchconf([
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

Similar effect can be achieved with `not` option. The last Provider will overwrite configuration in every situation except when `env` will equal 'production'.

```js
const { muchconf, EnvProvider, JsonProvider } = require('muchconf');

const configStore = muchconf([
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
const { muchconf, EnvProvider, JsonProvider } = require('muchconf');

const configStore = muchconf([
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

### Multiple instances of muchconf
By default calling `muchconf()` will always return the same instance of store. It is possible to create new store by passing unique key in `options.instance`.

```js
const muchconf = require('muchconf');

const instanceKey = 'unique_key';

const configStore = muchconf([], {
    instance: instanceKey
});

```

To reference to that instance the same key must be passed each time.

```js
const configStore = muchconf({ instance: 'unique_key' });
```


----------------------

## muchconf()
`muchconf` is a store for configuration. It accepts array of providers and additional options. Muchconf is `singleton`, which means wherever you require it in your project always will be returned the same instance (multiple instances are also possible - see [multiple muchconf instances](#Multiple%20instances%20of%20muchconf)).

__Syntax:__

```js
muchconf(providers, options);
```

__Parameters:__

| name                              | type                  | required  | default                   | description                                       |
|-----------------------------------|-----------------------|-----------|---------------------------|---------------------------------------------------|
|`providers`                        | array of Providers    | no        | []                        | Providers of configuration to feed the store      |
| `options`                         | object                | no        | see below                 |   options for muchconf                            |
| `options.instance`                | symbol or string      | no        | new `Symbol()` is created | Each instance of muchconf is identified by unique key. By default muchconf creates its key by its self. If more than one instance of muchconf is required it can be created by passing custom `instance` key. The same key must by used later to refer to this instance.
| `options.allowNullOrUndefined`    | boolean               | no        | `false`                   | Should `null` or `undefined` be treated as a proper value. If set to false (default behavior) `null` or `undefined` won't overwrite existing configuration.                                                                                            |

__Returns:__  
Instance of configuration store. 

### Methods
#### `load` 
Loads configuration from store. I returns promise, which resolves to configuration object. 

__Syntax:__
```js
configStore
    .load()
    .then((config) => {
        // configuration is avalivle here
    });
``` 

#### `get`
Returns configuration from store.

__Syntax:__
```js
let config = congiStore.get();
```

#### `getSymbol`
Returns unique key of instance.

__Syntax:__
```js
configStore.getSymbol();
```

### Events
Muchconf store is an instance of EventEmitter. During its lifecycle couple events are emitted.

| Event name    | Description                                                          |
|---------------|----------------------------------------------------------------------|
| `ready`       | Fired after store initialization and when final configuration is ready. `ready` event is fired only once in store lifecycle.
| `loaded`      | Fired whenever new configuration is ready. It is fired both after store initialization and after configuration update.
| `update`      | Fired after configuration update.
| `error`       | Fired whenever error occurs. 


Event cycle:

| state \ event name | ready | loaded | update |
|---------------|:-------:|:--------:|:--------:|
| Instance of muchconf initialized and configuration is ready | __yes__ | __yes__ | no |
| Configuration has been updated | no | __yes__ | __yes__ |

-----------------------
## Class: Provider
Each configuration provider extends this class. Provider is an instance of EventEmitter.

```js
new Provider(options);
```
__Parameters:__

| name         | type     | required  | default          | description                                       |
|--------------|----------|-----------|------------------|---------------------------------------------------|
| `options`      | object   | no        | see below        | options for provider                              |
| `options.castNumbers` | boolean | no | false | if possible, strings will be converted to number, e.g. '2' will be 2 |
| `options.convertTrueFalseStrings` | boolean | no | false | strings like 'true' or 'false' will be converted to boolean |
| `options.cutQuotations` | boolean | no | false | double quotation marks form beginning and ending of string will be cut off. E.g. '"some value"' will be 'some value' |
| `options.not` | object | no | undefined | conditions when provider should not be used |
| `options.is` | object | no  | undefined | conditions when provider should be used     |

### Methods
#### `enableWatching`
Sets watch property to true. Tells muchconf that Provider supports configuration watching.

__Syntax:__
```js
provider.enableWatching();
```
#### `parse`
If possible and enabled in options passed to provider transforms configuration value. 

__Syntax:__
```js
provider.parse(value);
```
__Parameters:__

| name         | type     | required  | default | description         |
|--------------|----------|-----------|---------|---------------------|
| value        | `string` | yes       |         | value to convert    |

_Returns:_  
Parsed value if it was possible in other case original one.


#### `castNumber`
If possible converts number-like value to number. 

__Syntax:__
```js
provider.castNumber(value);
```
__Parameters:__

| name         | type     | required  | default | description         |
|--------------|----------|-----------|---------|---------------------|
| value        | `string` | yes       |         | value to convert    |

__Returns:__  
Parsed value if it was possible in other case original one.
#### `convertTrueFalseString`
If possible converts strings like "true" or "false" to its boolean equivalent. It is case insensitive.

__Syntax:__
```js
provider.convertTrueFalseString(value);
```
__Parameters:__

| name         | type     | required  | default | description         |
|--------------|----------|-----------|---------|---------------------|
| value        | `string` | yes       |         | value to convert    |

_Returns:_  
Parsed value if it was possible in other case original one.
#### `cutQuotations`
If possible trims quotation marks from string.

__Syntax:__
```js
provider.cutQuotations(value);
```
__Parameters:__

| name         | type     | required  | default | description         |
|--------------|----------|-----------|---------|---------------------|
| value        | `string` | yes       |         | value to convert    |

_Returns:_  
Parsed value if it was possible in other case original one.

#### `load`
Loads configuration. It should be implemented in custom provider. If not it will always resolve to empty configuration.

__Syntax:__
```js
provider.load();
```
__Returns:__  
Promise which resolves to configuration object.

## Built in providers (configuration sources)
Provider represents source of configuration. Muchconf has 4 build in providers and supports external providers. Out of the box muchconf can get configuration form environmental variables, command line arguments, JSON or JSON file.

__Build-in providers:__  
1. [EnvProvider](#EnvProvider) - environmental variables  
2. [ArgvProvider](#ArgvProvider) - command line arguments  
3. [JsonProvider](#JsonProvider) - JSON (or javascript object)  
4. [JsonFileProvider](#JsonFileProvider) - JSON file  

### EnvProvider
EnvProvider gets configuration form environmental variables in OS.

__Syntax:__
```js
new EnvProvider(configurationMap, providerOptions)
```
__Parameters:__

| name                 | type     | required  | default | description         |
|----------------------|----------|-----------|---------|---------------------|
| `configurationMap`   | `object` | yes       |         | object representing configuration. It could be nested or include arrays. Each value will be replaced with value of ENV variable with that name   |
| `providerOptions`    | `object` | no        |         |common options for provider. See [Provider](##Provider) section |

__Example:__
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

__Syntax:__
```js
new ArgvProvider(configurationMap, providerOptions)
```
__Parameters:__

| name                 | type     | required  | default | description         |
|----------------------|----------|-----------|---------|---------------------|
| `configurationMap`   | `object` | yes       |         | object representing configuration. It could be nested or include arrays. Each value will be replaced with value of option with that name preceded with double dash.   |
| `providerOptions`    | `object` | no        |         |common options for provider. See [Provider](##Provider) section |


__Example:__
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

__Syntax:__
```js
new JsonProvider(json, providerOptions)
```
__Parameters:__

| name                 | type     | required  | default | description         |
|----------------------|----------|-----------|---------|---------------------|
| `json`               | `object` | yes       |         | object with configuration   |
| `providerOptions`    | `object` | no        |         | common options for provider. See [Provider](##Provider) section |


__Example:__
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

__Syntax:__
```js
new JsonFileProvider(filePath, providerOptions)
```
__Parameters:__

| name                 | type     | required  | default | description         |
|----------------------|----------|-----------|---------|---------------------|
| `filePath`           | `string` | yes       |         | path to file with configuration |
| `providerOptions`    | `object` | no        |         | common options for provider. See [Provider](##Provider) section |

__Example:__
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
By itself Provider is not very useful, it will always return empty configuration :). Provider class allows to create custom providers.

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

Provider can emit `update` event when configuration changes. `muchconf` listens for those events and can reload application. To enable provider watching method `startWatching` must be called.

```js
const { Provider } = require('muchconf');
const database = require('someDatabase');

class AwsomeProvider extends Provider {
    constructor(commonOptions) {
        super(commonOptions);
        this.db = database.connect();

        this.configuration = {};
        this.enableWatching();
        watchForChanges();
    }

    async getConfiguration() {
        return this.db.select('configuration');
    }

    watchForChanges() {
        setTimeout( async () => {
            let config = await this.db.select('configuration');
            // Make sure that configuration has changed!
            this.configuration = config;
            watchForChanges();
        }, 60000)
    }

    async load() {
        this.configuration = await getConfiguration();
        return Promise.resolve(this.configuration);
    }
}
```

## Examples

See examples:
 - [HTTP server with muchconf](examples/server)


## Tests

```js
npm run test
```