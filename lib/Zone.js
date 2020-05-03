'use strict';
const constants = require('./constants');

let gpio;
if (process.env.PHYSICAL_ENV === constants.physicalEnvs.RASPBERRY_PI) {
  gpio = require('rpi-gpio');
} else {
  gpio = require('../test/mocks/rpi-gpio');
}

const MACHINE_STATE = {
  on: false,
  off: true
};

const MACHINE_DIRECTION = {
  'in': gpio.DIR_IN,
  'out': gpio.DIR_OUT
};

class Zone {
  constructor(id, pin) {
    this.id = id;
    this.pin = pin;
    this.direction = undefined;
    this.state = undefined;
  }

  setState(state) {
    return new Promise((resolve, reject) => {
      if (undefined === MACHINE_STATE[state]) {

        reject(`setState: Invalid state for Zone ${this.id}. Expected 'on' or 'off', but got '${state}'.`);
      }

      gpio.write(this.pin, MACHINE_STATE[state], (err) => {
        if (err) reject(err);
        this.state = state;
        resolve(this.state);
      });
    });
  }

  getState() {
    return new Promise((resolve) => {
      resolve(this.state);
    });
  }

  setDirection(direction) {
    return new Promise((resolve, reject) => {
      if (undefined === MACHINE_DIRECTION[direction]) {

        reject(`setDirection: Invalid direction for Zone ${this.id}. Expected 'in' or 'out', but got ${direction}.`);
      }

      gpio.setup(this.pin, direction, (err) => {
        if(err) reject(err);
        this.direction = direction;
        resolve(direction);
      });
    });
  }

  getDirection() {
    return new Promise((resolve) => {
      resolve(this.direction);
    });
  }

  getId() {
    return new Promise((resolve) => {
      resolve(this.id);
    });
  }

  getPin() {
    return new Promise((resolve) => {
      resolve(this.pin);
    });
  }
}

module.exports = Zone;
