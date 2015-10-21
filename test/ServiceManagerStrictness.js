/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

var assert = require('assert'),
    Application = require('../Application'),
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

    it('should provide strict mode api.', function() {
        var sm = new ServiceManager;

        assert(typeof sm.getStrictMode === 'function', 'Strict mode getter does not exist.');
        assert(typeof sm.setStrictMode === 'function', 'Strict mode setter does not exist.');
    });

    it('should provide fluent interface on strict mode setter.', function() {
        var sm = new ServiceManager;

        assert(sm.setStrictMode(true) === sm, 'Strict mode setter does not provide fluent interface.');
        assert(sm.setStrictMode(false) === sm, 'Strict mode setter does not provide fluent interface.');
    });

    it('should be non strict by default.', function() {
        var sm = new ServiceManager;

        assert(sm.getStrictMode() === false, 'The service manager has to be non strict by default.');
    });

    it('should set strict mode correctly.', function() {
        var sm = new ServiceManager;

        sm.setStrictMode(true);

        assert(sm.getStrictMode() === true, 'Setting the service manager into strict mode failed.');

        sm.setStrictMode(false);

        assert(sm.getStrictMode() === false, 'Setting the service manager into non strict mode failed.');
    });

    it('should be able override service-manager`s strict-mode with strict param.', function() {
        var sm = new ServiceManager();

        sm.setStrictMode(true);

        assert.doesNotThrow(function() {
           sm.get('non-existent-service', false);
        });

        assert.doesNotThrow(function() {
            sm.remove('non-existent-service', false);
        });

        assert.doesNotThrow(function() {
            sm.set('existent-service', {}, false);
            sm.set('existent-service', {}, false);
        });
    });

    it('should throw an error when requesting non existent service in service-manager strict mode.', function() {
        var sm = new ServiceManager;

        sm.setStrictMode(true);

        assert.throws(function() {
            sm.get('non-existent-service');
        });
    });

    it('should not throw an error when requesting an existent service in service-manager strict mode.', function() {
        var sm = new ServiceManager;

        sm.setStrictMode(true);
        sm.set('existent-service', {});

        assert.doesNotThrow(function() {
            sm.get('existent-service');
        })
    });

    it('should throw an error when resetting an existent service in service-manager strict mode.', function() {
        var sm = new ServiceManager;

        sm.setStrictMode(true);
        sm.set('existent-service', {});

        assert.throws(function() {
            sm.set('existent-service', {});
        });
    });

    it('should not throw an error when setting a non existent service in service-manager strict mode.', function() {
        var sm = new ServiceManager;

        sm.setStrictMode(true);

        assert.doesNotThrow(function() {
            sm.set('existent-service', {});
        });
    });

    it('should throw an error when removing a non existent service in service-manager strict mode.', function() {
        var sm = new ServiceManager;

        sm.setStrictMode(true);

        assert.throws(function() {
            sm.remove('non-existent-service');
        });
    });

    it('should not throw an error when removing an existent service in service-manager strict mode.', function() {
        var sm = new ServiceManager;

        sm.setStrictMode(true);
        sm.set('existent-service', {});

        assert.doesNotThrow(function() {
            sm.remove('existent-service');
        });
    });

    it('should be aware of setting the strictness of the service-manager through application config.', function() {
        var app = new Application;

        app.configure({
            configs: [{
                'service-manager': {
                    strictMode: true
                }
            }]
        }).bootstrap().launch();

        assert(
            app.getServiceManager().getStrictMode() === true,
            'The service manager`s strict mode has to be configurable through application config.'
        );
    });
});
