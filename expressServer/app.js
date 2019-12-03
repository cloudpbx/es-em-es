const Express = require('express');
const app = Express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const telnyx = require('telnyx')('KEY016EC7DF1D08F8D9FEC2FCE0263B0811_LpK2t8vlrGx2TypnqsfrZz');
const publicKey = "6JHIzNE/VcU3l6M6GJMhUaHURMJJIbRKL6CCE+e1QUg=";
const router = Express.Router();

// Define redis client.
var redis = require('redis')
const redisPass = 'yJLT6Moy66AwvFwusmkGgHRXzSmYoTHUVG7luqnDvlpHfF6tEYY5Lb4b5dmbWS4i31EsTXj3cUn07Rs71CvcVvIaTKa4p0KCln6q1dtsGwIzbSCVXHW9QIMMXlYBBHb0glGESweTUoM9dwNt7MbvVAmKNzjN2h719HLUhwGJfHagyPGgpxGEsepsLUGXRHv8VrswHXR6B1bI0LvngU92FfiCn0hxqiOALlS4JtIDIjdRYkASkfk5XqBBiPk7PI35';
var redisClient = redis.createClient();
redisClient.auth(redisPass);
redisClient.on("error", (err) => {
  console.log("Error " + err);
});

// Receive webhooks from telnyx, and push them to sockets.
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
router.post("/webhook/oV2KDfSKNQb1SRMGsRzJ", addRawBody, (request, response) => {
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
      return;
    case 'message.finalized':
      redisClient.rpush(event.data.payload.from + '|' + event.data.payload.to[0].phone_number, JSON.stringify(event.data));
      io.sockets.emit('sentFinalized', event.data);
    // Handle received messages.
    case 'message.received':
      redisClient.rpush(event.data.payload.to + '|' + event.data.payload.from.phone_number, JSON.stringify(event.data));
      io.sockets.emit('receiveMessage', event.data);
    // Lost and found.
    default:
        io.sockets.emit('receiveMessage:lost+found', event.data);
  }
  
  response.status(200).send('Signed Webhook Received: ' + event.data.id);
});

// Add webhook route to app.
app.use(router);



io.on('connection', function (socket) {
  redisClient.lrange( "list1", 0, -1, (error, messages) => { // Load messages on connect
    socket.emit('loadMessages', messages);
  })
  socket.on('sendMessage', (data) => {
    telnyx.messages.create({
      'from': '+17786542857', // Your Telnyx number
      'to': '+1' + data.number,
      'text': data.message
  }).then(function(response){
    const message = response.data;
    socket.emit('sentMessage', message);
  }).catch(error => console.log('Error in sending message: ' + JSON.stringify(error)))})
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
