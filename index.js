'use strict';
require('dotenv').config({ path: __dirname + '/.env' }); // explicit path for cron
const path = require('path');
const express = require('express');
const winston = require('winston');
const moment = require('moment');
const Zone = require('./lib/Zone');
const ZoneController = require('./lib/ZoneController');


// ws
const WebSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(1337, function() { });
const wsServer = new WebSocketServer({ httpServer: server });
// end ws


var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: function () {
        return new moment().format();
      }
    }),
    new winston.transports.File({
      filename: process.env.LOG_FILE_PATH,
      timestamp: function () {
        return new moment().format();
      }
    })
  ]
});

const app = express();
const PORT = process.env.PORT;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let zc = new ZoneController(),
  z1 = new Zone(1, process.env.PIN_CH_1),
  z2 = new Zone(2, process.env.PIN_CH_2),
  z3 = new Zone(3, process.env.PIN_CH_3),
  z4 = new Zone(4, process.env.PIN_CH_4),
  z5 = new Zone(5, process.env.PIN_CH_5),
  z6 = new Zone(6, process.env.PIN_CH_6),
  z7 = new Zone(7, process.env.PIN_CH_7),
  z8 = new Zone(8, process.env.PIN_CH_8);


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


// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('string msg: ', message.utf8Data);
      let object;
      try {
        object = JSON.parse(message.utf8Data);
      } catch (e) {
        logger.error(e);
      }
      console.log('json msg: ', object);
    }
  });

  connection.on('close', function(connection) {
    // close user connection
  });
});

setInterval(function() {
  const message = {
    type: 'CHANNEL_STATE',
    payload: {

    },
  };
  wsServer.broadcast(message);
  console.log('sending', message);
}, 1000);
// End websocker server


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
