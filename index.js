'use strict';

const path = require('path');
const express = require('express');
const winston = require('winston');
const moment = require('moment');
const Zone = require('./lib/Zone');
const ZoneController = require('./lib/ZoneController');

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: function () {
        return new moment().format();
      }
    }),
    new winston.transports.File({
      filename: '/var/log/martins-sprinklers.log',
      timestamp: function () {
        return new moment().format();
      }
    })
  ]
});

const app = express();
const PORT = 3217;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
    try {
      app.use('/', express.static(path.join(__dirname, 'public')))
      app.listen(PORT, () => {});
      let msg = `Martins' sprinklers app listening on ${PORT}`;
      logger.info(msg);
      resolve(msg);
    } catch(e) {
      reject(e);
    }
  });
}

app.get('/channel/all/:state', (req, res) => {
  zc.setStateAll(req.params.state)
    .then( () => {
      let msg = `Successfully set all channels to ${req.params.state}.`;
      let rsp = {
        id: 'all',
        state: req.params.state,
        msg: msg
      };
      logger.info(msg);
      res.send(rsp);
    })
    .catch( e => {
      let msg = `Error setting all channels to ${req.params.state}. ${e}`;
      logger.error(msg);
      res.send(msg);
    });
});

app.get('/channel/:id/:state', (req, res) => {
  zc.get(req.params.id)
    .then(zone => {
      return zone.setState(req.params.state);
    })
    .then( () => {
      let msg = `Set zone ${req.params.id} to ${req.params.state}.`;
      let rsp = {
        id: req.params.id,
        state: req.params.state,
        msg: msg
      };
      logger.info(msg);
      res.send(rsp);
    })
    .catch( e => {
      let rsp = {
        id: req.params.id,
        state: req.params.state,
        msg: e
      };
      logger.error(e);
      res.status(400).send(rsp);
    });
});

app.get('/channel/:id', (req, res) => {
  zc.get(req.params.id)
    .then(zone => {
      return zone.getState();
    })
    .then(_state => {
      let msg = `Zone ${req.params.id} is ${_state}.`;
      let rsp = {
        id: req.params.id,
        state: _state,
        msg: msg
      };
      logger.info(msg); 
      res.send(rsp);
    })
    .catch( e => {
      let rsp = {
        id: req.params.id,
        state: req.params.state,
        msg: e
      };
      logger.error(e);
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
  .then(msg => logger.info(msg))
  .then(() => zc.setDirectionAll('out'))
  .then(msg => logger.info(msg))
  .then(() => zc.setStateAll('off'))
  .then(msg => logger.info(msg))
  .then(() => serve())
  .then(msg => logger.info(msg))
  .catch(e => {
    logger.error(`Error on sprinklers init. ${e}`);
  });
