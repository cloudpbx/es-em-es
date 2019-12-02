var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const telnyx = require('telnyx')('KEY016EC7DF1D08F8D9FEC2FCE0263B0811_LpK2t8vlrGx2TypnqsfrZz');

server.listen(8000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('newMessage', { hello: 'world' });
  socket.on('sendMessage', function (data) {
    telnyx.messages.create({
      'from': '+17786542857', // Your Telnyx number
      'to': '+16043551695',
      'text': data
  }).then(function(response){
    const message = response.data; // asynchronously handled
  });
  });
});