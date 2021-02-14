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

  // What to do when we receive a message from the client?
  socket.on('message', (message, room) => {
    log(`Client said: ${message}`);
    socket.in(room).emit('message', message, room);
  });

  // What to do when a room is created or joined?
  socket.on('create or join', (room) => {
    log(`Received request to create or join room ${room}`);

    // Find clients in the current room:
    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom
      ? Object.keys(clientsInRoom.sockets).length
      : 0;
    log(`Room ${room} now has ${numClients} client(s)`);

    // If no client is in the room, create a room and add the client.
    if (numClients === 0) {
      socket.join(room);
      log(`Client ID ${socket.id} created room ${room}`);
      socket.emit('created', room, socket.id);
    } else if (numClients === 1) {
      log(`Client ID ${socket.id} joined room ${room}`);
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
    }

    // If two clients are already present in the room, do not add this client.
    // I am lazy, so there is a maximum of two clients.
    else {
      socket.emit('full', room);
    }
  });

  // Utility event.
  socket.on('ipaddr', () => {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach((details) => {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  // Event for notifying other clients when a client leaves the room.
  socket.on('bye', () => {
    console.log('received bye');
  });
});
