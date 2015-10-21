/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

var assert = require('assert'),
    ServiceManager = require('../ServiceManager');

describe('srvoa::service-manager::strictness', function() {
    it('should throw an error when requesting non existent service in strict mode.', function() {
        var sm = new ServiceManager;

        assert.throws(function() {
          sm.get('non-existent-service', true);
        })
    });

    it('should not throw an error when requesting an existent service in strict mode.', function() {
        var sm = new ServiceManager;

        sm.set('existent-service', {});

        assert.doesNotThrow(function() {
            sm.get('existent-service', true);
        })
    });

    it('should throw an error when resetting an existent service in strict mode.', function() {
        var sm = new ServiceManager;

        sm.set('existent-service', {});

        assert.throws(function() {
            sm.set('existent-service', {}, true);
        });
    });

    it('should not throw an error when setting a non existent service in strict mode.', function() {
        var sm = new ServiceManager;

        assert.doesNotThrow(function() {
            sm.set('existent-service', {}, true);
        })
    });

    it('should throw an error when removing a non existent service in strict mode.', function() {
        var sm = new ServiceManager;

        assert.throws(function() {
            sm.remove('non-existent-service', true);
        });
    });

    it('should not throw an error when removing an existent service in strict mode.', function() {
        var sm = new ServiceManager;

        sm.set('existent-service', {}, true);

        assert.doesNotThrow(function() {
            sm.remove('existent-service', true);
        });
    });
});
