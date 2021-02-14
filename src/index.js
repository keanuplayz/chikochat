'use strict';

import * as os from 'os';
import * as express from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';
var app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

var server = http.createServer(app);

server.listen(process.env.PORT || 8000);
