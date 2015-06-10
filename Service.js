var declare = require('decl/declare');

module.exports = declare({
    /**
     * The service manager instance.
     *
     * @var {ServiceManager}
     */
    serviceManager: null,

    /**
     * Create a new service instance.
     *
     * @param {ServiceManager} [serviceManager] - The service manager instance.
     */
    constructor: function Service(serviceManager) {
        if (serviceManager) {
            this.serviceManager = serviceManager;
        }
    },

    /**
     * Returns the service manager instance.
     *
     * @return {ServiceManager}
     */
    getServiceManager: function() {
        return this.serviceManager;
    },

    /**
     * Sets the service manager instance.
     *
     * @param   {ServiceManager} serviceManager
     * @return  {Service}
     */
    setServiceManager: function(serviceManager) {
        this.serviceManager = serviceManager;

        return this;
    },

    /**
     * Configures the service.
     *
     * @param   {Object} [config]
     * @return  {Service}
     */
    configure: function(config) {
        return this;
    },

    /**
     * Bootstrap the service logic.
     *
     * @return  {Service}
     */
    bootstrap: function() {
        return this;
    },

    /**
     * Launch the service logic.
     *
     * @return  {Service}
     */
    launch: function() {
        return this;
    }
});
