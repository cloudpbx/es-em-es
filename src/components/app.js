'use strict';

const Telnyx = require('telnyx');
const Express = require('express');

const apiKey = process.env.TELNYX_API_KEY;
const publicKey = process.env.TELNYX_PUBLIC_KEY;

const telnyx = Telnyx(apiKey);

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

router.post('/webhooks', addRawBody, function(request, response) {
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

  console.log('Success', event.data.id);

  response.status(200).send('Signed Webhook Received: ' + event.data.id);
});

const app = Express();
app.use(router);
app.listen(3000, function() {
  console.log('SMS App listening on port 3000!')
});