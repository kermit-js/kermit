/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

var declare = require('decl/declare'),
    Service = require('../../Service'),
    a = 0, b = 0, c = 0;

var TestService = declare({
    extend: Service,

    configure: function(config) {
        this.config = config || {};

        this.configureOrder = ++a;

        return this;
    },

    bootstrap: function() {
        this.bootstrapOrder = ++b;

        return this;
    },

    launch: function() {
        this.launchOrder = ++c;

        return this;
    }
});

var Service1 = declare({
    extend: TestService
});

var Service2 = declare({
    extend: TestService,
});

var Service3 = declare({
    extend: TestService,

    statics: {
        CONFIG_KEY: 's3'
    }
});

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
