/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

"use strict";

var Service = require('../../Service'),
    a = 0, b = 0, c = 0;

class TestService extends Service {
    configure(config) {
        this.config = config || {};

        this.configureOrder = ++a;

        return this;
    }

    bootstrap() {
        this.bootstrapOrder = ++b;

        return this;
    }

    launch() {
        this.launchOrder = ++c;

        return this;
    }
}

class Service1 extends  TestService {}

class Service2 extends  TestService {}

class Service3 extends  TestService {
    static get CONFIG_KEY() {
        return 's3';
    }
}

module.exports = {
    app: {
        services: {
            s2: Service1,
            s1: TestService,
            s3: TestService
        }
    },

    foo: {
        bar: 123,
        baz: 'test'
    }
};
