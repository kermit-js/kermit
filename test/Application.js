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

    it('should be able to handle `app.services` object and function definition.', function() {
        var app = new Application;

        app.configure({
            configs: [{
                app: {
                    services: {
                        test: {
                            service: Service
                        },
                        test2: Service,
                        test3: {
                            service: null,
                        },
                        test4: null
                    }
                }
            }]
        }).bootstrap().launch();

        assert(
          app.getServiceManager().get('test') instanceof Service,
          'Expect service `test` to be a service within the service manager of type `Service`.'
        );

        assert(
          app.getServiceManager().get('test2') instanceof Service,
          'Expect service `test2` to be a service within the service manager of type `Service`.'
        );

        assert(
          app.getServiceManager().has('test3') === false,
          'Expect service `test3` to not exists within the service manager.'
        );

        assert(
          app.getServiceManager().has('test4') === false,
          'Expect service `test4` to not exists within the service manager.'
        );
    });

    it('should configure the services by service key (as config key) from `app.services` as a fallback.', function() {
       var app = new Application;

        app.configure({
            configs: [{
                app: {
                    services: {
                        test: Service,
                        test2: Service
                    }
                }
            }, {
                test: {
                    foo: 'bar'
                }
            }]
        }).bootstrap().launch();

        assert(
          app.getServiceManager().get('test').serviceConfig.get('foo') === 'bar',
          'Expect service `test` to be configured with a foo: bar through service key fallback.'
        );

        assert(
          Object.keys(app.getServiceManager().get('test2').serviceConfig.getHash()).length === 0,
          'Expect service `test2` to be configured with no config through service key fallback with non existent config.'
        );
    });

    it('should configure the services by static CONFIG_KEY rather then by service key.', function() {
        class ServiceWithStaticConfigKey extends Service {
            static get CONFIG_KEY() {
                return 'test-test';
            }
        }

        class ServiceWithStaticConfigKeyNull extends Service {
            static get CONFIG_KEY() {
                return null;
            }
        }

        var app = new Application;

        app.configure({
            configs: [{
                app: {
                    services: {
                        test: ServiceWithStaticConfigKey,
                        test2: {
                            service: ServiceWithStaticConfigKeyNull
                        }
                    }
                }
            }, {
                'test-test': {
                    foo: 'bar'
                }
            }]
        }).bootstrap().launch();

        assert(
          app.getServiceManager().get('test').serviceConfig.get('foo') === 'bar',
          'Expect service `test` to be configured with a foo: bar through static CONFIG_KEY.'
        );

        assert(
          Object.keys(app.getServiceManager().get('test2').serviceConfig.getHash()).length === 0,
          'Expect service `test2` to be configured with no config through static CONFIG_KEY that equals `null`.'
        );
    });

    it('should configure the services by configKey property rather then by static CONFIG_KEY.', function() {
        class ServiceWithMultipleConfigKeys extends Service {
            static get CONFIG_KEY() {
                return 'test-test';
            }

            get configKey() {
                return 'test';
            }
        }

        class ServiceWithMultipleConfigKeysNull extends Service {
            static get CONFIG_KEY() {
                return 'test';
            }

            get configKey() {
                return null;
            }
        }

        var app = new Application;

        app.configure({
            configs: [{
                app: {
                    services: {
                        test: ServiceWithMultipleConfigKeys,
                        test2: {
                            service: ServiceWithMultipleConfigKeysNull
                        }
                    }
                }
            }, {
                'test': {
                    foo: 'bar'
                }
            }]
        }).bootstrap().launch();

        assert(
          app.getServiceManager().get('test').serviceConfig.get('foo') === 'bar',
          'Expect service `test` to be configured with a foo: bar through configKey property.'
        );

        assert(
          Object.keys(app.getServiceManager().get('test2').serviceConfig.getHash()).length === 0,
          'Expect service `test2` to be configured with no config through configKey property that equals `null`.'
        );
    });

    it('should configure the services by configKey from service definition rather then by the service\'s configKey property.', function() {
        class ServiceWithConfigKey extends Service {
            get configKey() {
                return 'test';
            }
        }

        var app = new Application;

        app.configure({
            configs: [{
                app: {
                    services: {
                        test: {
                            service: ServiceWithConfigKey,
                            configKey: 'test-test'
                        },
                        test2: {
                            service: ServiceWithConfigKey,
                            configKey: null
                        }
                    }
                }
            }, {
                'test-test': {
                    foo: 'bar'
                }
            }]
        }).bootstrap().launch();

        assert(
          app.getServiceManager().get('test').serviceConfig.get('foo') === 'bar',
          'Expect service `test` to be configured with a foo: bar through the service definition configKey property.'
        );

        assert(
          Object.keys(app.getServiceManager().get('test2').serviceConfig.getHash()).length === 0,
          'Expect service `test2` to be configured with no config through the service definition configKey property that equals `null`.'
        );
    });
});
