/* global describe, it */

const chai = require('chai');
const mock = require('mock-require');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should(); //use "should" style of chai

mock('rpi-gpio', './mocks/rpi-gpio');

// The module to test:
const Zone = require('../lib/Zone');


describe('Zone class', () => {
  let Z1 = new Zone(1, 33);
  let Z2 = new Zone(2, 34);

  describe('state', () => {
    it('should set on', () => {
      return Z1.setState('on').should.eventually.equal('on');
    });
    it('should get on', () => {
      return Z1.getState().should.eventually.equal('on');
    });
    it('should set off', () => {
      return Z1.setState('off').should.eventually.equal('off');
    });
    it('should get off', () => {
      return Z1.getState().should.eventually.equal('off');
    });
  });

  describe('direction', () => {
    it('should set out', () => {
      return Z1.setDirection('out').should.eventually.equal('out');
    });
    it('should get out', () => {
      return Z1.getDirection().should.eventually.equal('out');
    });
    it('should set in', () => {
      return Z1.setDirection('in').should.eventually.equal('in');
    });
    it('should get in', () => {
      return Z1.getDirection().should.eventually.equal('in');
    });
  });

  describe('id', () => {
    it('should get id', () => {
      return Z1.getId().should.eventually.equal(1);
    });
    it('should get id', () => {
      return Z2.getId().should.eventually.equal(2);
    });
  });

  describe('pin', () => {
    it('should get pin', () => {
      return Z1.getPin().should.eventually.equal(33);
    });
    it('should get pin', () => {
      return Z2.getPin().should.eventually.equal(34);
    });
  });
});
