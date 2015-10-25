/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/kermit-js/kermit/blob/support/sr voa/LICENSE BSD-2-Clause
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
            s2: Service2,
            s1: Service1,
            s3: Service3
        }
    },

    foo: {
        bar: 123,
        baz: 'test'
    }
};
