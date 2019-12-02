const Express = require('express');
const app = Express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const telnyx = require('telnyx')('KEY016EC7DF1D08F8D9FEC2FCE0263B0811_LpK2t8vlrGx2TypnqsfrZz');

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
      // publicKey
    );
  } catch (e) {
    console.log('Error', e.message);

    return response.status(400).send('Webhook Error:' + e.message);
  }

  console.log('Success', event.data.id);

  response.status(200).send('Signed Webhook Received: ' + event.data.id);
});

io.on('connection', function (socket) {
  socket.emit('newMessage', { hello: 'world' });
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

app.use(router);

app.listen(8000, function() {
  console.log('SMS App listening on port 8000!')
});