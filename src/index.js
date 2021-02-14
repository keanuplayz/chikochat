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

/* Start SocketIO related stuff. */
var io = socketIO(server);

// As soon as the client connects to this socket, the `connection` event is fired.
io.sockets.on('connection', (socket) => {
  // Utility function to log server messages on the client.
  // `arguments` is an array-like object which contains all arguments of log().
  // To push all arguments of log() in that array to our `message` array, all we have to use is apply().
  function log() {
    var message = ['Message from server:'];
    array.push.apply(message, arguments);
    socket.emit('log', message);
  }
});
