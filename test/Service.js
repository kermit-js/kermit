/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/kermit-js/kermit/blob/support/sr voa/LICENSE BSD-2-Clause
 */

const
    assert = require('assert'),
    Config = require('../Config'),
    Service = require('../Service'),
    ServiceManager = require('../ServiceManager'),
    ServiceWithDefaultConfig = require('./lib/ServiceWithDefaultConfig'),
    EventEmitter = require('events').EventEmitter;

describe('srvoa::service', function() {
    it('extends the event emitter.', function() {
        var srv = new Service;

        assert(srv instanceof EventEmitter);
    });

    it('provides a configure method.', function() {
        var srv = new Service;

        assert(typeof srv.configure === 'function');
    });

    it('provides a fluent interface on configure method.', function() {
        var srv = new Service;

        assert(srv.configure() === srv);
    });

    it('provides a bootstrap method.', function() {
        var srv = new Service;

        assert(typeof srv.bootstrap === 'function');
    });

    it('provides a fluent interface on bootstrap method.', function() {
        var srv = new Service;

        assert(srv.bootstrap() === srv);
    });

    it('provides a launch method.', function() {
        var srv = new Service;

        assert(typeof srv.launch === 'function');
    });

    it('provides a fluent interface on launch method.', function() {
        var srv = new Service;

        assert(srv.launch() === srv);
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

    it('creates internal serviceConfig during configuration.', function() {
        var srv = new Service();

        assert(srv.serviceConfig === null, 'Expected `serviceConfig` to be null before configure is called.');

        srv.configure();

        assert(srv.serviceConfig instanceof Config, 'Expected `serviceConfig` to be instance of `Config` after configure is called.');
    });

    it('should pass the right config hash to serviceConfig.', function() {
        var srv = new Service();

        srv.configure({
            test: {
                test2: 1
            }
        });

        assert(srv.serviceConfig.get('test.test2') === 1, 'Expected config key `test.test2` to equal 1.');

        srv.configure({});

        assert(srv.serviceConfig.get('test.test2') === undefined, 'Expected config key `test.test2` to equal undefined after resetting configuration.');
    });

    it('should apply the default service config during configuration.', function() {
        var srv = new ServiceWithDefaultConfig();

        assert(srv.serviceConfig === null, 'Expected `serviceConfig` to be null before configure is called.');

        srv.configure();

        assert(srv.serviceConfig instanceof Config, 'Expected `serviceConfig` to be instance of `Config` after configure is called.');
        assert(srv.serviceConfig.get('test.test2') === 1, 'Expected default service config to be applied thus config key `test.test2` must equal 1.');
    });

    it('should merge config into default service config during configuration.', function() {
        var srv = new ServiceWithDefaultConfig();

        srv.configure({
            test: {
                test2: 2
            },
            test2: 1
        });

        assert(srv.serviceConfig.get('test.test2') === 2, 'Expected configs got merged properly thus config key `test.test2` must equal 2.');
        assert(srv.serviceConfig.get('test.test3') === 1, 'Expected configs got merged properly thus config key `test.test3` must equal 1.');
        assert(srv.serviceConfig.get('test2') === 1, 'Expected configs got merged properly thus config key `test2` must equal 1.');
    });
});
