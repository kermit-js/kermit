var declare = require('decl/declare');

module.exports = declare({
    /**
     * The map of key => service.
     *
     * @var Object
     */
    services: null,

    /**
     * Initialize services map.
     */
    constructor: function ServiceManager() {
        this.services = {};
    },

    /**
     * Lookup and return a service by its key.
     *
     * @param   string key
     * @return  Object|undefined
     */
    get: function(key) {
        return this.services[key];
    },

    /**
     * Store a service for the given key.
     *
     * @param   string key
     * @param   Object service
     * @return  ServiceManager
     */
    set: function(key, service) {
        this.services[key] = service;

        return this;
    },

    /**
     * Delete the service for the given key.
     *
     * @param   string key
     * @return  ServiceManager
     */
    remove: function(key) {
        delete this.services[key];

        return this;
    },

    /**
     * Check for the existens of a service by its key.
     *
     * @param   string key
     * @return  boolean
     */
    has: function(key) {
        return (key in this.services);
    }
});
