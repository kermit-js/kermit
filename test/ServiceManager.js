/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

var assert = require('assert'),
    ServiceManager = require('../ServiceManager');

describe('srvoa::service-manager', function() {
    var dummyService = {};

    it('should set a service for a given key.', function() {
        var sm = new ServiceManager;

        sm.set('dummy', dummyService);

        assert(sm.get('dummy') === dummyService);
    });

    it('should expose existence of a service by its key.', function() {
        var sm = new ServiceManager;

        assert(sm.has('dummy') === false);

        sm.set('dummy', dummyService);

        assert(sm.has('dummy') === true);
    });

    it('should be able to remove a service by its key.', function() {
        var sm = new ServiceManager;

        sm.set('dummy', dummyService);
        sm.remove('dummy');

        assert(sm.has('dummy') === false);
    });
});
