const ChannelConfigurations = require('../src/index');
const chai = require('chai');
const assert = require('assert');

describe('AppDirect ChannelConfiguration Tests', () => {
  chai.should();

  const testConfigurations = new Map()
    .set('appdirect', {
      name: 'appdirect',
      partner: 'APPDIRECT',
      baseUrl: 'https://www.appdirect.com'
    })
    .set('test', {
      name: 'test',
      partner: 'APPDIRECT',
      baseUrl: 'https://test.appdirect.com'
    });

  describe('constructor', () => {
    it('Should work for a null constructor', () => {
      const configurations = new ChannelConfigurations();
      assert.equal(true, configurations instanceof ChannelConfigurations);
    });

    it('Should work for an undefined constructor', () => {
      const configurations = new ChannelConfigurations(undefined);
      assert.equal(true, configurations instanceof ChannelConfigurations);
    });

    it('Should create a new ChannelConfigurationCache with valid Array constructor.', () => {
      const configurations = new ChannelConfigurations([{
        name: 'test',
        partner: 'test',
        baseUrl: 'http://www.test.com'
      }]);

      assert.equal(true, configurations instanceof ChannelConfigurations);
    });

    it('Should create a new ChannelConfigurationCache with valid Map constructor.', (done) => {
      const map = new Map();
      map.set('test', {
        name: 'test',
        partner: 'test',
        baseUrl: 'http://www.test.com'
      });

      const configurations = new ChannelConfigurations(map);
      assert.equal(true, configurations instanceof ChannelConfigurations);
      done();
    });

    it('Should create a new ChannelConfigurationCache with valid Object constructor.', (done) => {
      const configurations = new ChannelConfigurations({
        test: {
          name: 'test',
          partner: 'test',
          baseUrl: 'http://www.test.com'
        }
      });
      assert.equal(true, configurations instanceof ChannelConfigurations);
      done();
    });

    it('Should throw an error when creating a new ChannelConfigurationCache with an invalid constructor type.', (done) => {
      try {
        const temp = new ChannelConfigurations(new Date());
        done(`Didn't throw expected exception: ${temp.toString()}`);
      } catch (e) {
        assert.equal(true, e.message.indexOf('Unsupported type for configuration field') >= 0, `Error ${e.message} doesn't contain the text 'Unsupported type for configuration field'`);
        done();
      }
    });
  });

  describe('method: toString()', () => {
    it('Should return a string representing all the channel configurations that are cached', (done) => {
      const channelConfigs = new ChannelConfigurations(testConfigurations);
      const text = channelConfigs.toString();
      text.should.be.a('string');
      done();
    });
  });

  describe('method: getConfigurations()', () => {
    it('Should return the cached map of configurations', (done) => {
      const channelConfigs = new ChannelConfigurations(testConfigurations);
      const configurations = channelConfigs.getConfigurations();

      configurations.should.be.a('map');

      const test = configurations.get('test');
      test.name.should.equal(testConfigurations.get('test').name);
      test.partner.should.equal(testConfigurations.get('test').partner);
      test.baseUrl.should.equal(testConfigurations.get('test').baseUrl);

      const appdirect = configurations.get('appdirect');
      appdirect.name.should.equal(testConfigurations.get('appdirect').name);
      appdirect.partner.should.equal(testConfigurations.get('appdirect').partner);
      appdirect.baseUrl.should.equal(testConfigurations.get('appdirect').baseUrl);
      done();
    });
  });

  describe('method: add()', () => {
    it('Should add a new test configuration', (done) => {
      const channelConfigs = new ChannelConfigurations(testConfigurations);
      channelConfigs.add({
        name: 'test_add',
        partner: 'test_partner',
        baseUrl: 'https://test.appdirect.com'
      });

      const configurations = channelConfigs.getConfigurations();
      configurations.should.be.a('map');

      const addedConfiguration = configurations.get('test_add');
      addedConfiguration.should.be.a('object');
      addedConfiguration.name.should.equal('test_add');
      addedConfiguration.partner.should.equal('test_partner');
      addedConfiguration.baseUrl.should.equal('https://test.appdirect.com');
      done();
    });

    it('Should throw an error for an empty configuration', (done) => {
      const channelConfigs = new ChannelConfigurations(testConfigurations);
      try {
        channelConfigs.add({});
        done('Should have thrown an error');
      } catch (e) {
        done();
      }
    });

    it('Should throw an error for a configuration missing the name property', (done) => {
      const channelConfigs = new ChannelConfigurations(testConfigurations);
      try {
        channelConfigs.add({
          partner: 'test_partner',
          baseUrl: 'https://test.appdirect.com'
        });
        done('Should have thrown an error');
      } catch (e) {
        done();
      }
    });

    it('Should throw an error for a configuration missing the partner property', (done) => {
      const channelConfigs = new ChannelConfigurations(testConfigurations);
      try {
        channelConfigs.add({
          name: 'test_add',
          baseUrl: 'https://test.appdirect.com'
        });
        done('Should have thrown an error');
      } catch (e) {
        done();
      }
    });

    it('Should throw an error for a configuration missing the baseUrl property', (done) => {
      const channelConfigs = new ChannelConfigurations(testConfigurations);
      try {
        channelConfigs.add({
          name: 'test_add',
          partner: 'test_partner'
        });
        done('Should have thrown an error');
      } catch (e) {
        done();
      }
    });


    it('Should throw an error for a configuration with an invalid baseUrl property', (done) => {
      const channelConfigs = new ChannelConfigurations(testConfigurations);
      try {
        channelConfigs.add({
          name: 'test_add',
          partner: 'test_partner',
          baseUrl: 'skdfljs'
        });
        done('Should have thrown an error');
      } catch (e) {
        done();
      }
    });
  });

  describe('method: get(name)', () => {
    it('Should get a valid configuration from the cached configurations', (done) => {
      const channelConfigs = new ChannelConfigurations(testConfigurations);
      const appdirectConfig = channelConfigs.get('appdirect');

      appdirectConfig.should.be.a('object');
      appdirectConfig.name.should.equal('appdirect');
      appdirectConfig.partner.should.equal('APPDIRECT');
      appdirectConfig.baseUrl.should.equal('https://www.appdirect.com');
      done();
    });

    it('Should throw an error if the configuration doesn\'t exit', (done) => {
      const channelConfigs = new ChannelConfigurations(testConfigurations);
      try {
        channelConfigs.get('invalidName');
        done('Should have thrown an error');
      } catch (e) {
        done();
      }
    });

    it('Should throw an error if the name parameter isn\'t provided.', (done) => {
      const channelConfigs = new ChannelConfigurations(testConfigurations);
      try {
        channelConfigs.get();
        done('Should have thrown an error');
      } catch (e) {
        done();
      }
    });
  });

  describe('method: delete(name)', () => {
    it('Should return true when deleting a chached configuration that exist.', (done) => {
      const channelConfigs = new ChannelConfigurations(testConfigurations);
      const response = channelConfigs.delete('appdirect');

      response.should.be.a('boolean');
      response.should.equal(true);
      done();
    });

    it('Should return false when deleting a chached configuration that doesn\'t exits.', (done) => {
      const channelConfigs = new ChannelConfigurations(testConfigurations);
      const response = channelConfigs.delete('invalidName');

      response.should.be.a('boolean');
      response.should.equal(false);
      done();
    });
  });
});
