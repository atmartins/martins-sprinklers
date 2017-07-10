/* global describe, it */

const chai = require('chai');
const mock = require('mock-require');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should(); //use "should" style of chai

const Zone = require('../lib/Zone');
mock('rpi-gpio', './mocks/rpi-gpio');
// The module to test:
const ZoneController = require('../lib/ZoneController');


describe('ZoneController class', () => {
  describe('add', () => {
    let zc = new ZoneController();
    zc.add(new Zone(1, 29));
    it('should add when id and pin are not taken.', () => {
      return zc.add(new Zone(2, 30)).should.eventually.have.property('id');
    });
    it('should not add when id is taken.', () => {
      // 9999 is a pin that isn't currently occupied.
      return zc.add(new Zone(1, 9999)).should.be.rejected;
    });
    it('should not add when pin is taken.', () => {
      // 9999 is an id that isn't currently occupied.
      return zc.add(new Zone(9999, 29)).should.be.rejected;
    });
  });

  describe('get', () => {
    let zc = new ZoneController();
    zc.add(new Zone(1, 29));
    it('should get by (int) id.', () => {
      zc.get(1).then(zone => {console.log(zone)})
      return zc.get(1).should.eventually.be.an.instanceof(Zone);
    });
    it('should get by (string) id.', () => {
      return zc.get("1").should.eventually.be.an.instanceof(Zone);
    });
  });

  describe('state', () => {
    let zc = new ZoneController();
    let z1 = new Zone(1, 29);
    let z2 = new Zone(2, 30);

    zc.add(z1);
    zc.add(z2);

    it('should set for all, on', () => {
      return zc.setStateAll('on').should.eventually.deep.equal(['on', 'on']);
    });
    it('should set zone 1 on, when all are on', () => {
      z1.setState('off'); //really make sure it's off!
      zc.setStateAll('on');
      return z1.getState().should.eventually.equal('on');
    });

    it('should set for all, off', () => {
      return zc.setStateAll('off').should.eventually.deep.equal(['off', 'off']);
    });
    it('should set zone 1 off, when all are off', () => {
      z1.setState('on'); //really make sure it's off!
      zc.setStateAll('off');
      return z1.getState().should.eventually.equal('off');
    });

    it('should not allow setting null state', () => {
      return zc.setStateAll(null).should.be.rejected;
    });
    it('should not allow setting false state', () => {
      return zc.setStateAll(false).should.be.rejected;
    });
    it('should not allow setting invalid state', () => {
      return zc.setStateAll('INVALID').should.be.rejected;
    });
  });

  describe('direction', () => {
    let zc = new ZoneController();
    zc.add(new Zone(1, 29));
    zc.add(new Zone(2, 30));
    it('should direct for all, out', () => {
      return zc.setDirectionAll('out').should.eventually.deep.equal(['out', 'out']);
    });
    it('should direct for all, in', () => {
      return zc.setDirectionAll('in').should.eventually.deep.equal(['in', 'in']);
    });
    it('should not allow an invalid direction', () => {
      return zc.setDirectionAll('INVALID').should.be.rejected;
    });
  });
});
