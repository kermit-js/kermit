/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/a-z/node-srvoa/blob/master/LICENSE BSD-2-Clause
 */

"use strict";

var fs = require('fs'),
    Service = require('./Service'),
    Config = require('./Config');

/**
 * The srvoa application class.
 */
class ConfigService extends Service {
    /**
     * The files to read and merge the config from.
     *
     * @property files {Array}
     */

    /**
     * The config instance.
     *
     * @property config {Config}
     */

    /**
     * Initialize the config service.
     *
     * @constructor
     */
    constructor(serviceManager) {
        super(serviceManager);

        this.config = new Config;
        this.files = [];
    }

    /**
     * @param   {Object} config
     * @return  {ConfigService}
     */
    configure(config) {
        if (config && typeof config.files !== 'undefined') {
            this.setFiles(config.files);
        }

        return this;
    }

    /**
     * @inheritDoc
     */
    launch() {
        this.readConfig();

        return this;
    }

    /**
     * Return the list of files to read the config from.
     *
     * @return {Array}
     */
    getFiles() {
        return this.files;
    }

    /**
     * Set the files to read the config from.
     *
     * @param   {Array} files
     * @returns {ConfigService}
     */
    setFiles(files) {
        this.files = files;

        return this;
    }

    /**
     * Read the config files (if existent) and recursively merge the settings.
     * The reader also adds support for simple comments in the config.json files.
     *
     * @return  {ConfigService}
     */
    readConfig() {
        var files = this.files,
            i = 0, l = files.length,
            file, data;

        // reset the config
        this.config.setConfig({});

        for (; i < l; ++i) {
            file = files[i];

            if (fs.existsSync(file)) {
                data = require(file);

                this.config.mergeConfig(data);
            }
        }

        return this;
    }

    /**
     * @return {Object}
     */
    getConfig() {
        return this.config.getHash();
    }

    /**
     * Sets and merges multiple config sets.
     *
     * @param   {...Object} config
     * @return  {ConfigService}
     */
    setConfig(config) {
        this.config.setConfig.apply(this.config, arguments);

        return this;
    }

    /**
     * @param   {String} key
     * @param   {*} defaultValue
     * @returns {*}
     */
    get(key, defaultValue) {
        return this.config.get(key, defaultValue);
    }
}

module.exports = ConfigService;
