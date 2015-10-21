/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

"use strict";

/**
 * The srvoa service manager.
 * It is responsible for holding the service registry and giving shared access to the service instances.
 */
class ServiceManager {
    /**
     * The map of key => service.
     *
     * @property services {Object}
     */

    /**
     * The strict mode flag of the service manager.
     * If set to true, the service manager will throw errors.
     *
     * @property {boolean} strictMode
     */

    /**
     * The config key for setting the strict mode of the service manager from application/configuration context.
     *
     * @returns {string}
     */
    static get STRICT_MODE_CONFIG_KEY() {
        return 'service-manager.strictMode';
    }

    /**
     * Initialize services map.
     *
     * @constructor
     */
    constructor() {
        this.services = {};
        this.strictMode = false;
    }

    /**
     * Retrieves the strict mode flag of the service manager.
     *
     * @returns {boolean}
     */
    getStrictMode() {
        return this.strictMode;
    }

    /**
     * Sets the strict mode flag of the service manager.
     *
     * @param {boolean} strictMode
     * @returns {ServiceManager}
     */
    setStrictMode(strictMode) {
        this.strictMode = strictMode;

        return this;
    }

    /**
     * Lookup and return a service by its key.
     *
     * @param   {String} key
     * @param   {Boolean} strict (optional) default false
     * @throws  {Error} if strict mode is enabled and there is no such service.
     * @return  {Object}|{undefined}
     */
    get(key, strict) {
        if (((this.strictMode === true && strict !== false) || strict === true) && !this.has(key)) {
            throw new Error(`Cannot return unknown service for key: ${key} in strict mode.`);
        }

        return this.services[key];
    }

    /**
     * Store a service for the given key.
     *
     * @param   {String} key
     * @param   {Object} service
     * @param   {Boolean} strict (optional) default false
     * @throws  {Error} if strict mode is enabled and a service for the given key already exists.
     * @return  {ServiceManager}
     */
    set(key, service, strict) {
        if (((this.strictMode === true && strict !== false) || strict === true) && this.has(key)) {
            throw new Error(`Cannot re-register service for key: ${key} in strict mode.`);
        }

        this.services[key] = service;

        return this;
    }

    /**
     * Delete the service for the given key.
     *
     * @param   {String} key
     * @param   {Boolean} strict (optional) default false
     * @return  {ServiceManager}
     */
    remove(key, strict) {
        if (((this.strictMode === true && strict !== false) || strict === true) && !this.has(key)) {
            throw new Error(`Cannot remove unknown service for key: ${key} in strict mode.`);
        }

        delete this.services[key];

        return this;
    }

    /**
     * Check for the existence of a service by its key.
     *
     * @param   {String} key
     * @return  {Boolean}
     */
    has(key) {
        return (key in this.services);
    }
}

module.exports = ServiceManager;
