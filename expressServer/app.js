const Express = require('express');
const app = Express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const telnyx = require('telnyx')('KEY016EC7DF1D08F8D9FEC2FCE0263B0811_LpK2t8vlrGx2TypnqsfrZz');
const publicKey = "6JHIzNE/VcU3l6M6GJMhUaHURMJJIbRKL6CCE+e1QUg=";

// Receive webhooks from telnyx, and push them to sockets.
const router = Express.Router();
function addRawBody(req, res, next) {
  req.setEncoding('utf8');

  var data = '';

  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    req.rawBody = data;

    next();
  });
}
router.post("/webhook/oV2KDfSKNQb1SRMGsRzJ", addRawBody, function(request, response) {
  var event;
  try {
    event = telnyx.webhooks.constructEvent(
      request.rawBody,
      request.header('telnyx-signature-ed25519'),
      request.header('telnyx-timestamp'),
      publicKey
    );
  } catch (e) {
    console.log('Error', e.message);

    return response.status(400).send('Webhook Error:' + e.message);
  }

  // Send the message to the right channel based on the from or to number and the event type.
  switch (event.data.event_type) {
    // Handle sent messages.
    case 'message.sent':
    case 'message.finalized':
      from = event.data.payload.from;
      io.sockets.emit('receiveMessage:'+from, event.data);

    // Handle received messages.
    case 'message.received':
      to = event.data.payload.to;
      io.sockets.emit('receiveMessage:'+to, event.data);

    // Lost and found.
    default:
        io.sockets.emit('receiveMessage:lost+found', event.data);
  }
  
  response.status(200).send('Signed Webhook Received: ' + event.data.id);
});

// Add webhook route to app.
app.use(router);



io.on('connection', function (socket) {
  socket.emit('receiveMessage', { connected: true });
  socket.on('sendMessage', function (data) {
    telnyx.messages.create({
      'from': '+17786542857', // Your Telnyx number
      'to': '+1' + data.number,
      'text': data.message
  }).then(function(response){
    const message = response.data; // asynchronously handled
  });
  });
});

server.listen(8000, function() {
  console.log('SMS App listening on port 8000!')
});

// // initialize sessionMiddleware to handle different users connecting to the socket at the same time.
// var sessionMiddleware = session({
//   store: new RedisStore({}), // XXX redis server config
//   secret: "keyboard cat",
// })
// // Socket-io connection stuff.
// io.use(function(socket, next) {
//   sessionMiddleware(socket.request, socket.request.res, next);
// });
// // Tell the sockets server to use the session middleware.
// server.use(sessionMiddleware);
