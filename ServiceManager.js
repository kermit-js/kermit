/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

"use strict";

/**
 * The srvoa service manager
 */
class ServiceManager {
    /**
     * The map of key => service.
     *
     * @property services {Object}
     */

    /**
     * Initialize services map.
     *
     * @constructor
     */
    constructor() {
        this.services = {};
    }

    /**
     * Lookup and return a service by its key.
     *
     * @param   {String} key
     * @return  {Object}|{undefined}
     */
    get(key) {
        return this.services[key];
    }

    /**
     * Store a service for the given key.
     *
     * @param   {String} key
     * @param   {Object} service
     * @return  {ServiceManager}
     */
    set(key, service) {
        this.services[key] = service;

        return this;
    }

    /**
     * Delete the service for the given key.
     *
     * @param   {String} key
     * @return  {ServiceManager}
     */
    remove(key) {
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
