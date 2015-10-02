/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

var declare = require('decl/declare'),
    Service = require('./Service'),
    ConfigService = require('./ConfigService'),
    ServiceManager = require('./ServiceManager'),
    Application;

module.exports = Application = declare({
    /**
     * @extends Service
     */
    extend: Service,

    statics: {
        APP_CONFIG_SERVICE_KEY: 'app.config'
    },

    /**
     * The config hash passed to configure.
     *
     * @var {Object}
     */
    applicationConfig: null,

    /**
     * @var {ConfigService}
     */
    configService: null,

    /**
     * Fetch and return the serviceManager.
     *
     * @return {ServiceManager}
     */
    getServiceManager: function () {
        if (this.serviceManager === null) {
            this.serviceManager = new ServiceManager;
        }

        return this.serviceManager;
    },

    /**
     * @return {ConfigService}
     */
    getConfigService: function() {
        return this.configService;
    },

    /**
     * @param   {ConfigService} configService
     * @return  {Application}
     */
    setConfigService: function(configService) {
        this.configService = configService;

        return this;
    },

    /**
     * @inheritDoc
     */
    configure: function(config) {
        this.applicationConfig = config || {};

        return this;
    },

    /**
     * Initialize the app config service. Try to fetch an instance from the service manager, otherwise
     * create a new one. Configure and launch the config service,
     *
     * @inheritDoc
     */
    bootstrap: function() {
        var serviceManager = this.getServiceManager(),
            configService, applicationConfig = this.applicationConfig;

        if (serviceManager.has(Application.APP_CONFIG_SERVICE_KEY) === false) {
            configService = new ConfigService;

            serviceManager.set(Application.APP_CONFIG_SERVICE_KEY, configService);
        } else {
            configService = serviceManager.get(Application.APP_CONFIG_SERVICE_KEY);
        }

        if (typeof applicationConfig.files !== 'undefined') {
            configService.configure({
                files: applicationConfig.files
            }).bootstrap().launch();
        } else if(typeof applicationConfig.configs !== 'undefined') {
            configService.setConfig.apply(configService, applicationConfig.configs);
        }

        this.configService = configService;

        return this;
    },

    /**
     * Look for services (configurable as 'app.services') to configure, bootstrap and launch.
     *
     * @inheritDoc
     */
    launch: function() {
        var configService = this.configService,
            serviceManager = this.getServiceManager(),
            servicesConfig = configService.get('app.services', {}),
            servicesToLoad = [],
            serviceKey, serviceClass, service, i, l;

        for (serviceKey in servicesConfig) {
            serviceClass = servicesConfig[serviceKey];

            if (serviceClass) {
                // instantiate the fetched service class.
                service = new serviceClass(serviceManager);
                serviceManager.set(serviceKey, service);

                servicesToLoad.push({
                    key: serviceKey,
                    instance: service,
                    definition: serviceClass
                });
            }
        }

        // configure all required services
        for (i = 0, l = servicesToLoad.length; i < l; ++i) {
            service = servicesToLoad[i];

            // in case the service class has a config key defined
            // try to load the service specific config and pass this to the configure method.
            if (typeof service.definition.CONFIG_KEY !== 'undefined') {
                service.instance.configure(
                    configService.get(service.definition.CONFIG_KEY)
                );
            } else {
                service.instance.configure();
            }
        }

        // bootstrap all required services
        for (i = 0, l = servicesToLoad.length; i < l; ++i) {
            servicesToLoad[i].instance.bootstrap();
        }

        // launch all required services
        for (i = 0, l = servicesToLoad.length; i < l; ++i) {
            servicesToLoad[i].instance.launch();
        }

        return this;
    }
});
