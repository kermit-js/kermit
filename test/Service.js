/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

const
    assert = require('assert'),
    Service = require('../Service'),
    ServiceManager = require('../ServiceManager'),
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
});
