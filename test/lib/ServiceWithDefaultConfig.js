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
