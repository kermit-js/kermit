/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/kermit-js/kermit/blob/support/srvoa/LICENSE BSD-2-Clause
 */

"use strict";

const
    Service = require('./Service'),
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

        serviceManager.setStrictMode(configService.get(ServiceManager.STRICT_MODE_CONFIG_KEY, false));

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
            servicesToLoad = [];

        for (let serviceKey in servicesConfig) {
            let
              serviceDefinition = servicesConfig[serviceKey];

            if (typeof serviceDefinition === 'function') {
                serviceDefinition = {
                    service: serviceDefinition
                };
            }

            if (serviceDefinition !== null && typeof serviceDefinition.service === 'function') {
                // instantiate the fetched service class.
                let service = new (serviceDefinition.service)(serviceManager);
                serviceManager.set(serviceKey, service);

                // determine the configkey
                if (typeof serviceDefinition.configKey !== 'string' && serviceDefinition.configKey !== null) {
                    if (typeof service.configKey === 'string' || service.configKey === null) {
                        serviceDefinition.configKey = service.configKey
                    } else if (typeof serviceDefinition.service.CONFIG_KEY === 'string' || serviceDefinition.service.CONFIG_KEY === null) {
                        serviceDefinition.configKey = serviceDefinition.service.CONFIG_KEY;
                    } else {
                        serviceDefinition.configKey = serviceKey;
                    }
                }

                servicesToLoad.push({
                    key: serviceKey,
                    instance: service,
                    definition: serviceDefinition.service,
                    configKey: serviceDefinition.configKey
                });
            }
        }

        // configure all required services
        for (let i = 0, l = servicesToLoad.length; i < l; ++i) {
            let service = servicesToLoad[i];

            // in case the service has a config key defined
            // try to load the service specific config and pass this to the configure method.
            if (typeof service.configKey === 'string') {
                service.instance.configure(
                    configService.get(service.configKey)
                );
            } else {
                service.instance.configure();
            }
        }

        // bootstrap all required services
        for (let i = 0, l = servicesToLoad.length; i < l; ++i) {
            servicesToLoad[i].instance.bootstrap();
        }

        // launch all required services
        for (let i = 0, l = servicesToLoad.length; i < l; ++i) {
            servicesToLoad[i].instance.launch();
        }

        return this;
    }
}

module.exports = Application;
