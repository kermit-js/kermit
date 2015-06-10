var assert = require('assert'),
    Service = require('../Service');

describe('srvoa::service', function() {
    it('provides a configure mothod.', function() {
        var srv = new Service;

        assert(typeof srv.configure === 'function');
    });

    it('provides a bootstrap method.', function() {
        var srv = new Service;

        assert(typeof srv.bootstrap === 'function');
    });

    it('provides a launch method.', function() {
        var srv = new Service;

        assert(typeof srv.launch === 'function');
    });
});
