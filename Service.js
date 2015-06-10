var declare = require('decl/declare');

module.exports = declare({
    /**
     * The service manager instance.
     *
     * @var ServiceManager
     */
    serviceManager: null,

    /**
     * Create a new service instance.
     */
    constructor: function Service() {},

    /**
     * Returns the service manager instance.
     *
     * @return ServiceManager
     */
    getServiceManager: function() {
        return this.serviceManager;
    },

    /**
     * Configures the service.
     *
     * @param   Object config
     * @return  Service
     */
    configure: function(config) {
        return this;
    },

    /**
     * Bootstrap the service logic.
     *
     * @param   ServiceManager serviceManager
     * @return  Service
     */
    bootstrap: function(serviceManager) {
        return this;
    },

    /**
     * Launch the service logic.
     *
     * @return  Service
     */
    launch: function() {
        return this;
    }
});
