'use strict';

class ZoneController {
  constructor() {
    this.zones = {};
    this.occupiedPins = {};
  }

  add(zone) {
    return new Promise((resolve, reject) => {
      Promise.all([
        zone.getId(),
        zone.getPin()
      ])
        .then( r => {
          let id = r[0],
            pin = r[1];
          if (this.zones[id]) {
            reject(`Zone with id ${id} already exists.`);
          } else if (this.occupiedPins.hasOwnProperty(pin)) {
            reject(`Zone with pin ${pin} already exists and belongs to zone with id ${id}.`);
          } else {
            this.zones[id] = zone;
            this.occupiedPins[pin] = id;
            resolve(zone);
          }
        });
    });
  }

  setDirectionAll(direction) {
    let a = [];
    for(let i in this.zones) {
      a.push(this.zones[i].setDirection(direction));
    }
    return Promise.all(a);
  }

  setStateAll(state) {
    let a = [];

    for(let i in this.zones) {
      a.push(this.zones[i].setState(state));
    }

    return Promise.all(a);
  }

  get(id) {
    return new Promise((resolve, reject) => {
      if (!this.zones[id]) {
        reject(`Cannot get zone with id ${id}.`);
      } else {
        resolve(this.zones[id]);
      }
    });
  }

}

module.exports = ZoneController;
