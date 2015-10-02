/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

var fs = require('fs'),
    declare = require('decl/declare'),
    Service = require('./Service');

function getConfigType(value) {
    var type = typeof value;

    if (type === 'object') {
        if (type instanceof Array) {
            type = 'array';
        }
    }

    return type;
}

function mergeConfig(dest, src) {
    var property,
        value,
        destType,
        srcType;

    for (property in src) {
        value = src[property];

        if (!property in dest) {
            dest[property] = value;
        } else if (value === null) {
            delete dest[property];
        } else {
            destType = getConfigType(dest[property]);
            srcType = getConfigType(value);

            if (destType === 'object' && srcType === 'object') {
                mergeConfig(dest[property], value);
            } else {
                dest[property] = value;
            }
        }
    }

    return dest;
}

module.exports = declare({
    extend: Service,

    /**
     * The files to read and merge the config from.
     *
     * @var {Array}
     */
    files: null,

    /**
     * The config hash.
     *
     * @var {Object}
     */
    config: null,

    /**
     * Initialize the config service.
     *
     * @constructor
     */
    constructor: function ConfigService() {
        this.config = {};
        this.files = [];
    },

    /**
     * @param   {Object} config
     * @return  {ConfigService}
     */
    configure: function(config) {
        if (typeof config.files !== 'undefined') {
            this.setFiles(config.files);
        }

        return this;
    },

    /**
     * @inheritDoc
     */
    launch: function() {
        this.readConfig();

        return this;
    },

    /**
     * Return the list of files to read the config from.
     *
     * @return {Array}
     */
    getFiles: function() {
        return this.files;
    },

    /**
     * Set the files to read the config from.
     *
     * @param   {Array} files
     * @returns {ConfigService}
     */
    setFiles: function(files) {
        this.files = files;

        return this;
    },

    /**
     * Read the config files (if existent) and recursively merge the settings.
     * The reader also adds support for simple comments in the config.json files.
     *
     * @return  {ConfigService}
     */
    readConfig: function() {
        var files = this.files,
            i = 0, l = files.length,
            file, data;

        this.config = {};

        for (; i < l; ++i) {
            file = files[i];

            if (fs.existsSync(file)) {
                data = require(file);

                mergeConfig(this.config, data);
            }
        }

        return this;
    },

    /**
     * @return {Object}
     */
    getConfig: function() {
        return Object(this.config);
    },

    /**
     * Sets and merges multiple config sets.
     *
     * @param   {...Object} config
     * @return  {ConfigService}
     */
    setConfig: function(config) {
        var l = arguments.length;

        if (l === 1) {
            this.config = arguments[0];
        } else {
            this.config = {};

            for (var i = 0; i < l; ++i) {
                mergeConfig(this.config, arguments[i]);
            }
        }

        return this;
    },

    /**
     * @param   {String} key
     * @param   {*} defaultValue
     * @returns {*}
     */
    get: function(key, defaultValue) {
        var parts = key.split('.'),
            l = parts.length,
            i = 0,
            scopeKey,
            scope = this.config;

        try {
            for (; i < l; ++i) {
                scopeKey = parts[i];

                if (scopeKey in scope) {
                    scope = scope[scopeKey];
                } else {
                    return defaultValue;
                }
            }

            return scope;
        } catch (e) {
            return defaultValue;
        }
    }
});
