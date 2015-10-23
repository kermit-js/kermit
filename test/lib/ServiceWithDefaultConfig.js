/**
 * kermit - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/kermit-js/kermit/blob/master/LICENSE BSD-2-Clause
 */

"use strict";

const Service = require('../../Service');

class ServiceWithDefaultConfig extends Service {
  getDefaultServiceConfig() {
    return {
      test: {
        test2: 1,
        test3: 1
      }
    };
  }
}

module.exports = ServiceWithDefaultConfig;
