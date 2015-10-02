/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

"use strict";

/**
 * Abstract class that defines the srvoa service interface.
 */
class Service {
    /**
     * The local reference to the service manager instance.
     *
     * @property serviceManager {ServiceManager}
     */

    /**
     * Create a new service instance.
     *
     * @constructor
     * @param {ServiceManager} [serviceManager] - The service manager instance.
     */
    constructor(serviceManager) {
        this.serviceManager = serviceManager || null;
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
        return this;
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
}

module.exports = Service;
