'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const bot = require('./bot');

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hearthstone!');
});

app.post('/trace', (req, res) => {
  res.send('trace request unsupported');
});

app.post('/mulligan', (req, res) => {
  const ret = bot.getMulliganAction(req.body);
  console.log('ret', ret);
  res.send(ret);
});

app.post('/play', (req, res) => {
  const startTime = Date.now();
  const ret = bot.getPlayAction(req.body);
  console.log('ret', ret);
  res.send(ret);
  console.log('response time', Date.now() - startTime);
});

console.log('listening on port 7625');
app.listen(7625);
