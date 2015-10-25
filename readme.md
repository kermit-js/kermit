[![NPM](https://nodei.co/npm/kermit.png?downloads=true)](https://nodei.co/npm/kermit/)
---
[![build status](https://ci.gitlab.com/projects/3656/status.png?ref=master)](https://ci.gitlab.com/projects/3656?ref=master)
[![coverage status](https://coveralls.io/repos/kermit-js/kermit/badge.svg?branch=master&service=github)](https://coveralls.io/github/kermit-js/kermit?branch=master)

# kermit - 1.3.0

- is the **infrastructure** for service oriented architecture (**SOA**) for node.js
- provides **unified interfaces** for writing **modular** apps and (micro-)**services**
- eases and unifies the **configuration** of apps and its modules
- enables **dependency injection**
- is written in **ES6** with **ES5** compatible build using babel
- is fully **tested** with mocha

---
Find the api docs on [kermit-js.readme.io](https://kermit-js.readme.io)

---

## The Doctrine

1. An application is complex. So lets split it into functional modules (**Services**),
each of them being way more **simple** and **exchangeable**.
2. All Services have an unified interface `configure([serviceConfig])`, `bootstrap()`, `launch()`.
3. All Services are **EventEmitters**.
4. The **ServiceManager** is the di-container of kermit in which all services are registered.
5. All Services have access to the ServiceManager.
6. An Application is a Service, that manages dependent services and their configuration in the ServiceManager.
7. An Application manages the life-cycle of its dependent services.


### The Vision

- There are many kermit wrappers for popular node.js modules.
- kermit is ported to other environments / programming languages.


## Install ##

`$ npm install kermit`


## Getting Started

A simple demo kermit application may look like this:

- config
    - application.js
    - application.local.js (excluded from vcs)
- src
    - DemoService.js
    - Application.js
- application.js

###### application.js

```js
var Application = require('./src/Application.js'),
    app;

app = new Application;
app.configure({
    files: [
        __dirname + '/config/application.js',
        __dirname + '/config/application.production.js',
        __dirname + '/config/application.local.js'
    ]
}).bootstrap().launch();

module.exports = app;
```

The application can read and merge multiple config files recursively (last wins).
If a config file does not exist, it is skipped silently. That makes environment specific configuration sexy.
- Split your application and services configuration into multiple files.
- Ignore the local config from vcs.
- Generate production / staging etc. config files (with credentials) in the CI-Tool.
Avoid having sensible data in vcs.
- Override selected configurations in a specific environment.

###### config/application.js

```js
modules.exports = {
    app: {
        services: {
          demo: require(__dirname + '/../src/DemoService')
        }
    },

    'demo-service': {
        slogan: 'Hey dude!'
    }
};
```

The application will manage all services defined in `app.services`.

###### config/application.local.js

```js
modules.exports = {
    'demo-service': {
        secret: '1234'
    }
};
```

###### src/Application.js

```js
"use strict";

var BaseApp = require('kermit').Application;

class Application extends BaseApp {}

modules.exports = Application;
```

###### src/DemoService.js

```js
"use strict";

var Service = require('kermit').Service;

class DemoService extends Service {
    static get CONFIG_KEY() {
        return 'demo-service';
    }

    constructor(serviceManager) {
        super(serviceManager);

        this.slogan = null;
        this.secret = null;
    }

    configure(config) {
        this.slogan = config.slogan;
        this.secret = config.secret;

        return this;
    }

    launch() {
        console.info('slogan: ' + this.slogan);

        if (this.secret) {
            console.info('secret: ' + this.secret);
        } else {
            console.info('No secret was configured.');
        }

        return this;
    }
}

modules.exports = DemoService;
```
---

Running `node application` will output the following to the cli:

```
slogan: Hey dude!
secret: 1234
```

### TODO

- Move the code above into a demo application repository
- Improve the docs
    - Examples
- Write third party module wrappers


### CHANGELOG

Please have a look at [CHANGELOG](https://gitlab.com/kermit-js/kermit/raw/master/CHANGELOG).


### LICENSE

The files in this archive are released under BSD-2-Clause license.
You can find a copy of this license in [LICENSE](https://gitlab.com/kermit-js/kermit/raw/master/LICENSE).


---
##### Attribution

Icon: IT Infrastructure by Emily van den Heever from the Noun Project
