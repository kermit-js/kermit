/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/kermit-js/kermit/blob/support/srvoa/LICENSE BSD-2-Clause
 */

"use strict";

/**
 * The config class with support for merging multiple hashes recursively and
 * retrieving a nested key by its dot separated string representation.
 */
class Config {
    /**
     * The config hash.
     *
     * @private
     * @property _configHash {Object}
     */

    /**
     * Initialize the private config hash property.
     *
     * @constructor
     */
    constructor() {
        this._configHash = {};
    }

    /**
     * Sets and merges multiple config sets.
     *
     * @param   {...Object} config
     * @return  {ConfigService}
     */
    setConfig(config) {
        var l = arguments.length;

        if (l === 1) {
            this._configHash = arguments[0];
        } else {
            this._configHash = {};

            for (let i = 0; i < l; ++i) {
                this._mergeConfig(this._configHash, arguments[i]);
            }
        }

        return this;
    }

    /**
     * Merge the given config into the private config hash.
     *
     * @param {Object} config
     * @returns {Config}
     */
    mergeConfig(config) {
        this._mergeConfig(this._configHash, config);

        return this;
    }

    /**
     * @param   {String} key
     * @param   {*} defaultValue
     * @returns {*}
     */
    get(key, defaultValue) {
        var parts = key.split('.'),
            l = parts.length,
            i = 0,
            scopeKey,
            scope = this._configHash;

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

    /**
     * Returns the private config hash.
     *
     * @returns {Object}
     */
    getHash() {
        return this._configHash;
    }

    /**
     * Calculate the type of a value - used by recursive merge logic.
     *
     * @private
     * @param value
     * @returns {string}
     */
    _getConfigType(value) {
        var type = typeof value;

        if (type === 'object') {
            if (Array.isArray(value)) {
                type = 'array';
            }
        }

        return type;
    }

    /**
     * Recursively merge object src into dest. Array values won't be merged but overridden.
     *
     * @param dest
     * @param src
     * @returns {*}
     */
    _mergeConfig(dest, src) {
        for (let property in src) {
            let value = src[property];

            if (!(property in dest)) {
                dest[property] = value;
            } else if (value === null) {
                delete dest[property];
            } else {
                let destType = this._getConfigType(dest[property]);
                let srcType = this._getConfigType(value);

                if (destType === 'object' && srcType === 'object') {
                    this._mergeConfig(dest[property], value);
                } else {
                    dest[property] = value;
                }
            }
        }

        return dest;
    }
}

module.exports = Config;
