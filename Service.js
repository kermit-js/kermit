/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/kermit-js/kermit/blob/support/srvoa/LICENSE BSD-2-Clause
 */

"use strict";

const
    EventEmitter = require('events').EventEmitter,
    Config = require('./Config');

/**
 * Abstract class that defines the srvoa service interface.
 */
class Service extends EventEmitter {
    /**
     * The local reference to the service manager instance.
     *
     * @property serviceManager {ServiceManager}
     */

    /**
     * The config passed to configure as config service..
     *
     * @property serviceConfig {Config}
     */

    /**
     * Create a new service instance.
     *
     * @constructor
     * @param {ServiceManager} [serviceManager] - The service manager instance.
     */
    constructor(serviceManager) {
        super();

        this.serviceManager = serviceManager || null;
        this.serviceConfig = null;
    }

    /**
     * Returns the service manager instance.
     *
     * @return {ServiceManager}
     */
    getServiceManager() {
        return this.serviceManager;
    }

    /**
     * Sets the service manager instance.
     *
     * @param   {ServiceManager} serviceManager
     * @return  {Service}
     */
    setServiceManager(serviceManager) {
        this.serviceManager = serviceManager;

        return this;
    }

    /**
     * Configures the service.
     *
     * @param   {Object} [config]
     * @return  {Service}
     */
    configure(config) {
        return this._applyConfig(config);
    }

    /**
     * Bootstrap the service logic.
     *
     * @return  {Service}
     */
    bootstrap() {
        return this;
    }

    /**
     * Launch the service logic.
     *
     * @return  {Service}
     */
    launch() {
        return this;
    }

    /**
     * Return the default service config.
     *
     * @returns {Object|false}
     */
    getDefaultServiceConfig() {
        return false;
    }

    /**
     * Take a config hash and turn it into a config instance that is stored as `serviceConfig` property.
     * Before that the default service config is applied.
     *
     * @param config
     * @returns {Service}
     * @private
     */
    _applyConfig(config) {
        var defaultConfig = this.getDefaultServiceConfig();

        this.serviceConfig = new Config;

        if (defaultConfig !== false) {
            this.serviceConfig.setConfig(defaultConfig);
        }
        if (config) {
            this.serviceConfig.mergeConfig(config);
        }

        return this;
    }
}

module.exports = Service;
