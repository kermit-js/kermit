/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/kermit-js/kermit/blob/support/sr voa/LICENSE BSD-2-Clause
 */

"use strict";

module.export = {
    Application: require('./build/Application'),
    Config: require('./build/Config'),
    ConfigService: require('./build/ConfigService'),
    Service: require('./build/Service'),
    ServiceManager: require('./build/ServiceManager')
};
