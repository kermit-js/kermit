var assert = require('assert'),
    Service = require('../Service'),
    ConfigService = require('../ConfigService');

describe('srvoa::config-service', function() {
    it('is derivative of abstract service.', function() {
        var srv = new ConfigService;

        assert(srv instanceof Service);
    });

    it('should configure config files to load.', function() {
        var srv = new ConfigService,
            files = [
                './config/config-1.js',
                './config/config-2.js'
            ];

        srv.configure({
            files: files
        });

        assert(files === srv.getFiles());
    });
    
    it('should ignore non existent files.', function() {
       assert.doesNotThrow(function() {
           var srv = new ConfigService,
               files = [
                   './config/config-1.js',
                   './config/config-does-not-exists.js'
               ];

           srv.configure({
               files: files
           }).bootstrap().launch();
       });
    });

    it('should return undefined if key was not found.', function() {
        var srv = new ConfigService;

        assert(typeof srv.get('foo') === 'undefined');
    });

    it('should be aware of returning default value if key was not found.', function() {
        var srv = new ConfigService;

        [true, false, 1, 0, '', 'test', [], {}, new Date].forEach(function(value) {
            assert(srv.get('not.existent.key', value) === value);
            assert(srv.get('not-existent-key', value) === value);
        });
    });

    it('should merge multiple config hashes.', function() {
        var srv = new ConfigService;

        srv.setConfig({
            foo: 1,
            bar: 1,
            nested: {
                foo: 1,
                bar: 1
            }
        }, {
            bar: 'ok',
            nested: {
                foo: 'ok'
            }
        });

        assert(srv.get('foo') === 1);
        assert(srv.get('bar') === 'ok');

        assert(srv.get('nested.bar') === 1);
        assert(srv.get('nested.foo') === 'ok');
    });

    it('should merge multiple config files.', function() {
        var srv = new ConfigService,
            files = [
                __dirname + '/config/config-1.js',
                __dirname + '/config/config-2.js'
            ];

        srv.configure({
            files: files
        }).bootstrap().launch();

        assert(srv.get('foo') === 1);
        assert(srv.get('bar') === 'ok');

        assert(srv.get('nested.bar') === 1);
        assert(srv.get('nested.foo') === 'ok');
    });
});
