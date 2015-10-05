/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

var assert = require('assert'),
    Service = require('../Service'),
    Application = require('../Application'),
    ServiceManager = require('../ServiceManager'),
    ConfigService = require('../ConfigService');

describe('srvoa::application', function() {
    it('is derivative of abstract service.', function() {
        var app = new Application;

        assert(app instanceof Service);
    });

    it('should auto create a service manager.', function() {
        var app = new Application;

        assert(app.getServiceManager() instanceof ServiceManager);
    });

    it('allows passing a service manager instance on construction time.', function() {
        var serviceManager = new ServiceManager,
            app = new Application(serviceManager);

        assert(app.getServiceManager() === serviceManager);
    });

    it('should auto create an app config service on bootstrap.', function() {
        var app = new Application;

        assert(app.configure().bootstrap().getConfigService() instanceof ConfigService);
    });

    it('should use existent config service from service manager.', function() {
        var sm = new ServiceManager,
            configService = new ConfigService,
            app = new Application(sm);

        sm.set(Application.APP_CONFIG_SERVICE_KEY, configService);

        assert(app.getConfigService() === null);
        assert(app.configure().bootstrap().getConfigService() === configService);
    });

    it('allows setting the config service instance with fluent interface.', function() {
        var app = new Application,
            configService = new ConfigService;

        assert(app.setConfigService(configService) === app);
        assert(app.getConfigService() === configService);
    });

    it('should be able to read and merge config from multiple files.', function() {
        var app = new Application;

        app.configure({
            files: [
                __dirname + '/config/app.config.global.js',
                __dirname + '/config/app.config.local.js'
            ]
        });

        app.bootstrap();

        assert(app.getConfigService().get('foo.bar') === 123);
        assert(app.getConfigService().get('foo.baz') === 'ok');
    });

    it('should be able to take and merge multiple configs.', function() {
        var app = new Application;

        app.configure({
            configs: [
                require(__dirname + '/config/app.config.global.js'),
                require(__dirname + '/config/app.config.local.js')
            ]
        });

        app.bootstrap();

        assert(app.getConfigService().get('foo.bar') === 123);
        assert(app.getConfigService().get('foo.baz') === 'ok');
    });

    it('should auto load the configured services.', function() {
        var app = new Application;

        app.configure({
            files: [
                __dirname + '/config/app.config.global.js',
                __dirname + '/config/app.config.local.js'
            ]
        });

        app.bootstrap().launch();

        assert(app.getServiceManager().has('s1'));
        assert(app.getServiceManager().has('s2'));
        assert(app.getServiceManager().has('s3'));
    });
});
