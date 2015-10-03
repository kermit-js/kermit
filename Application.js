/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

"use strict";

var Service = require('./Service'),
    ConfigService = require('./ConfigService'),
    ServiceManager = require('./ServiceManager');

/**
 * The srvoa application class.
 */
class Application extends Service {
    /**
     * The config hash passed to configure.
     *
     * @property applicationConfig {Object}
     */

    /**
     * The reference to the application config service.
     *
     * @property configService {ConfigService}
     */

    /**
     * The config service key within the service manager.
     *
     * @returns {string}
     */
    static get APP_CONFIG_SERVICE_KEY() {
        return 'app.config';
    }

    /**
     * @inheritDoc
     */
    constructor(serviceManager) {
        super(serviceManager);

        this.applicationConfig = null;
        this.configService = null;
    }

    /**
     * Fetch and return the serviceManager.
     *
     * @return {ServiceManager}
     */
    getServiceManager() {
        if (this.serviceManager === null) {
            this.serviceManager = new ServiceManager;
        }

        return this.serviceManager;
    }

    /**
     * @return {ConfigService}
     */
    getConfigService() {
        return this.configService;
    }

    /**
     * @param   {ConfigService} configService
     * @return  {Application}
     */
    setConfigService(configService) {
        this.configService = configService;

        return this;
    }

    /**
     * @inheritDoc
     */
    configure(config) {
        this.applicationConfig = config || {};

        return this;
    }

    /**
     * Initialize the app config service. Try to fetch an instance from the service manager, otherwise
     * create a new one. Configure and launch the config service,
     *
     * @inheritDoc
     */
    bootstrap() {
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
    }

    /**
     * Look for services (configurable as 'app.services') to configure, bootstrap and launch.
     *
     * @inheritDoc
     */
    launch() {
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
}

module.exports = Application;
