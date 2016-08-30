'use strict';
const _ = require('lodash');
const url = require('url');

class ChannelConfigurations {
  constructor(configurations, options) {
    this.logger = _.get(options, 'logger', console);

    this.configurations = new Map();
    if (configurations) {
      this.setConfigurations(configurations);
    }
  }

  toString() {
    const json = {};
    this.configurations.forEach((value, key) => {
      json[key] = value;
    });

    return JSON.stringify(json);
  }

  getConfigurations() {
    return this.configurations;
  }

  setConfigurations(configurations) {
    this.configurations.clear();

    if (configurations instanceof Map) {
      this.configurations = new Map(configurations);
    } else if (configurations instanceof Array) {
      this.configurations.clear();
      for (const c of configurations) {
        this.add(c);
      }
    } else if (configurations instanceof Object && !_.isEmpty(configurations)) {
      _.forOwn(configurations, (value, key) => {
        value.name = key;
        this.add(value);
      });
    } else {
      throw new Error(`Unsupported type for configuration field:${typeof configurations}.  Configurations must be of the following types: Map<name, configuration>, List<configuration>, or Object<name, configuration>`);
    }

    return this.configurations;
  }

  add(configuration) {
    if (_.isEmpty(configuration)) {
      throw new Error('Couldn\'t add empty configuration');
    }

    if (!configuration.name) {
      throw new Error(`name is a required field: ${JSON.stringify(configuration)}`);
    }

    if (!configuration.partner) {
      throw new Error(`partner is a required field: ${JSON.stringify(configuration)}`);
    }

    if (!configuration.baseUrl) {
      throw new Error(`baseUrl is a required field: ${JSON.stringify(configuration)}`);
    }
    const parsedBaseUrl = url.parse(configuration.baseUrl);
    if (!parsedBaseUrl.protocol || !parsedBaseUrl.host || !parsedBaseUrl.path) {
      throw new Error(`Invalid baseUrl: ${configuration.baseurl}, must be a properly formatted url according to the node URL object.`);
    }

    this.configurations.set(configuration.name.toLowerCase(), configuration);
  }

  get(name) {
    if (!name) {
      throw new Error('name is a requied argument');
    }

    const configuration = this.configurations.get(name.toLowerCase());
    if (!configuration) {
      throw new Error(`Configuration with the name: ${name} doesn't exist.  Valid names are ${this.configurations.keys().toString()}`);
    }

    return configuration;
  }

  delete(name) {
    return this.configurations.delete(name);
  }
}

module.exports = ChannelConfigurations;
