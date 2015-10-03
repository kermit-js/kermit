/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

var assert = require('assert'),
    Service = require('../Service'),
    ServiceManager = require('../ServiceManager');

describe('srvoa::service', function() {
    it('provides a configure mothod.', function() {
        var srv = new Service;

        assert(typeof srv.configure === 'function');
    });

    it('provides a bootstrap method.', function() {
        var srv = new Service;

        assert(typeof srv.bootstrap === 'function');
    });

    it('provides a launch method.', function() {
        var srv = new Service;

        assert(typeof srv.launch === 'function');
    });

    it('allows passing a service manager instance on construction time.', function() {
        var serviceManager = new ServiceManager,
            srv = new Service(serviceManager);

        assert(srv.getServiceManager() === serviceManager);
    });

    it('allows setting the service manager instance delayed.', function() {
        var serviceManager = new ServiceManager,
            srv = new Service();

        srv.setServiceManager(serviceManager);

        assert(srv.getServiceManager() === serviceManager);
    });
});
