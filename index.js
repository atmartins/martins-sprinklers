'use strict';

const gpio = require('rpi-gpio');
const express = require('express');
const Zone = require('./lib/Zone');
const ZoneController = require('./lib/ZoneController');

const app = express();
const PORT = 3217;

let zc = new ZoneController(),
  z1 = new Zone(1, 29),
  z2 = new Zone(2, 31),
  z3 = new Zone(3, 33),
  z4 = new Zone(4, 35),
  z5 = new Zone(5, 37),
  z6 = new Zone(6, 36),
  z7 = new Zone(7, 38),
  z8 = new Zone(8, 40);


function serve() {
  return new Promise((resolve, reject) => {
    app.use(express.static('public'));
    app.listen(PORT, () => {});
    resolve(`Martins' sprinklers app listening on ${PORT}`);
  });
}

app.put('/channel/all/:state', (req, res) => {
  zc.setStateAll(req.params.state)
    .then( () => {
      let rsp = {
        id: 'all',
        state: req.params.state,
        msg: `Successfully set all channels to ${req.params.state}.`
      };
      res.send(rsp);
    })
    .catch( e => {
      res.send(`Error setting all channels to ${req.params.state}. ${e}`);
    });
});

app.put('/channel/:id/:state', (req, res) => {
  zc.get(req.params.id)
    .then(zone => {
      return zone.setState(req.params.state);
    })
    .then( () => {
      let rsp = {
        id: req.params.id,
        state: req.params.state,
        msg: `Set zone ${req.params.id} to ${req.params.state}.`
      };
      res.send(rsp);
    })
    .catch( e => {
      let rsp = {
        id: req.params.id,
        state: req.params.state,
        msg: e
      };
      res.status(400).send(rsp);
    });
});

app.get('/channel/:id', (req, res) => {
  zc.get(req.params.id)
    .then(zone => {
      return zone.getState();
    })
    .then(_state => {
      let rsp = {
        id: req.params.id,
        state: _state,
        msg: `Zone ${req.params.id} is ${_state}.`
      };
      res.send(rsp);
    })
    .catch( e => {
      let rsp = {
        id: req.params.id,
        state: req.params.state,
        msg: e
      };
      res.status(400).send(rsp);
    });
});


Promise.all([
  zc.add(z1),
  zc.add(z2),
  zc.add(z3),
  zc.add(z4),
  zc.add(z5),
  zc.add(z6),
  zc.add(z7),
  zc.add(z8)
])
  .then(msg => console.log(msg))
  .then(() => zc.setDirectionAll('out'))
  .then(msg => console.log(msg))
  .then(() => zc.setStateAll('off'))
  .then(msg => console.log(msg))
  .then(() => serve())
  .then(msg => console.log(msg))
  .catch(e => {
    console.log(e);
  });
