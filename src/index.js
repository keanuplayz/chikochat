'use strict';

// We can use ES modules, apparently!
// Most likely will come back to bite my ass, but hey, might as well try!
import * as os from 'os';
import * as express from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';

var app = express();

// This folder will contain our JS and CSS for the frontend.
// If I'm lucky, I might be able to use things like `postcss` and `scss` to compile and load SCSS files.
app.use(express.static('public'));

// The default route is defined here, and our default view is also rendered here.
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Here we initialize our HTTP server and associate it with Express' app...
var server = http.createServer(app);
// ...and start it. There's a choice to listen to a user-provided port, or the default port 8000.
server.listen(process.env.PORT || 8000);
