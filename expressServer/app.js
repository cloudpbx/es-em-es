var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const telnyx = require('telnyx')('KEY016EC7DF1D08F8D9FEC2FCE0263B0811_LpK2t8vlrGx2TypnqsfrZz');

server.listen(8000);

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Add webhook route.
app.post("/webhook/oV2KDfSKNQb1SRMGsRzJ", function (req, res) {
  console.log(req.body.from);
  console.log(req.body.body);
  res.message("Success");
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