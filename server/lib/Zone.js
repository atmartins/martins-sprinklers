'use strict';
const moment = require('moment');
const constants = require('./constants');
const db = require('./Db');
const ws = require('./Ws');

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

const DEFAULT_RUN_TIME_MS = 1000 * 60 * 60; // 1 hr

class Zone {
  constructor(id, pin) {
    const that = this;

    this.id = id;
    this.pin = pin;
    this.direction = undefined;
    this.state = undefined;
    this.onAt;
    this.runForMs = DEFAULT_RUN_TIME_MS; // amount of time to sprinkle for, unless manually turned-off
    this.timeoutFn = () => {
      that.setState('off').then(() => {
        // TODO - move this to index.js
        ws.broadcastObj({ id: that.id, state: 'off', msg: `Zone ${that.id} set to "off" by auto-off-timer after ${that.runForMs} milliseconds` });
      });
    };
    this.timeoutId = undefined;
  }

  setState(state, runForMs = undefined) {
    if (runForMs) { this.runForMs = runForMs; }

    return new Promise((resolve, reject) => {
      if (undefined === MACHINE_STATE[state]) {
        return reject(`setState: Invalid state for Zone ${this.id}. Expected 'on' or 'off', but got '${state}'.`);
      }

      if (state === 'on') {
        this.onAt = moment();
        this.timeoutId = setTimeout(this.timeoutFn, this.runForMs);
      }

      if (state === 'off') {
        if (this.onAt) {
          const offAt = moment();
          const diffMs = offAt.diff(this.onAt);
          db.writePoint(this.id, diffMs, this.onAt.valueOf(), offAt.valueOf());
        }
        this.onAt = undefined;
        this.runForMs = DEFAULT_RUN_TIME_MS;
        clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
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
