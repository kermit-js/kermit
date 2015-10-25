/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/kermit-js/kermit/blob/support/sr voa/LICENSE BSD-2-Clause
 */

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

    it('should not fail with empty config.', function() {
        assert.doesNotThrow(function() {
            var srv = new ConfigService;

            srv.configure().bootstrap().launch();
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

    it('should not fail when trying to access non existent config path.', function() {
        var srv = new ConfigService;

        srv.setConfig({
            key1: null,
            key2: false,
            key3: undefined,
            key4: "",
            key5: 12
        });

        // use default value for assertion
        assert(srv.get('key1.xyz', true));
        assert(srv.get('key2.xyz', true));
        assert(srv.get('key3.xyz', true));
        assert(srv.get('key4.xyz', true));
        assert(srv.get('key5.xyz', true));
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

    it('should not try to merge arrays but override them.', function() {
        var srv = new ConfigService;

        srv.setConfig({
            a: [1, 2]
        }, {
            a: [2]
        });

        assert(srv.get('a').length === 1 && srv.get('a')[0] === 2);
    });

    it('should delete a config key when overriden with null.', function() {
        var srv = new ConfigService;

        srv.setConfig({
            a: 'test',
            b: {}
        }, {
            a: null,
            b: null
        });

        assert(srv.get('a') === undefined);
        assert(srv.get('b') === undefined);
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

    it('should give access to the config hash.', function() {
        var srv = new ConfigService,
            files = [
                __dirname + '/config/config-1.js',
                __dirname + '/config/config-2.js'
            ];

        srv.configure({
            files: files
        }).bootstrap().launch();

        var config = srv.getConfig();

        assert(config.foo === 1);
        assert(config.bar === 'ok');
        assert(config.nested.bar === 1);
        assert(config.nested.foo === 'ok');
    });
});
