var declare = require('decl/declare');

module.exports = declare({
    /**
     * The map of key => service.
     *
     * @var {Object}
     */
    services: null,

    /**
     * Initialize services map.
     *
     * @constructor
     */
    constructor: function ServiceManager() {
        this.services = {};
    },

    /**
     * Lookup and return a service by its key.
     *
     * @param   {String} key
     * @return  {Object}|{undefined}
     */
    get: function(key) {
        return this.services[key];
    },

    /**
     * Store a service for the given key.
     *
     * @param   {String} key
     * @param   {Object} service
     * @return  {ServiceManager}
     */
    set: function(key, service) {
        this.services[key] = service;

        return this;
    },

    /**
     * Delete the service for the given key.
     *
     * @param   {String} key
     * @return  {ServiceManager}
     */
    remove: function(key) {
        delete this.services[key];

        return this;
    },

    /**
     * Check for the existence of a service by its key.
     *
     * @param   {String} key
     * @return  {Boolean}
     */
    has: function(key) {
        return (key in this.services);
    }
});
