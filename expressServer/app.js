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
    case 'message.finalized':
      redisClient.rpush('list1', JSON.stringify(event.data));
      io.sockets.emit('receiveMessage', event.data);

    // Handle received messages.
    case 'message.received':
      redisClient.rpush('list1', JSON.stringify(event.data));
      io.sockets.emit('receiveMessage', event.data);

    // Lost and found.
    default:
        io.sockets.emit('receiveMessage:lost+found', event.data);
  }
  
  response.status(200).send('Signed Webhook Received: ' + event.data.id);
});

// Add webhook route to app.
app.use(router);

server.listen(8080, function() {
  console.log('SMS App listening on port 8000!')
});

// Manage connection/user
io.on('connection', (socket) => {
  console.log('New Connection');
  // Empty user
  socket._user = new User(socket);
  // Handle disconnect
  socket.on('disconnect', () => {
    socket._user.clear();
    delete socket._user;
  });
  socket.on('phoneNumber', (data) => {
    socket._user.phoneNumber = data.phoneNumber;
    socket._user.loadMessages(-1);
  });
  socket.on('sendMessage', (data) => {
    telnyx.messages.create({
      'from': socket._user.phoneNumber , // Your Telnyx number
      'to': '+1' + data.number,
      'text': data.message
  }).then(function(response){
    const message = response.data;
    socket.emit('sentMessage', message);
  }).catch(error => console.log('Error in sending message: ' + JSON.stringify(error)))})
});

class User {
  /**
   * Constructor for user
   * @param {any} socket the socket for this user
   */
  constructor(socket) {
    this.socket = socket;
    this.clear();
  }
  /**
   * Login function
   * @param {Object} user_data the user data (kazoo_user, permissions, ...)
   * @param {number} ttl the time to live for this login
   */
  login (user_data, ttl) {
    this.clear();
    // If it has user_data and ttl
    if (user_data && ttl) {
      // Complete the login
      this.auth = true;
      // Let the user know of the successful authentication
      this.socket.emit('status', {
        auth: true,
        ttl: ttl,
        permissions: this.permissions
      });
      // Prepare to logout the user
      setTimeout(()=>{
        this.logout(`Your key has expired`);
      }, (ttl - 1) * 1000);
    } else {
      this.logout(`No login data`);
    }
  }
  /**
   * Logout function
   * @param {string=} reason an optional reason for logging out the user
   */
  logout (reason) {
    this.clear();
    this.socket.emit('status', {
      auth: false,
      reason: (reason ? reason : false)
    });
  }
  /**
   * Clears the user (effectively a shadow logout)
   */
  clear () {
    // If it has any active store
    if (this.store_item) {
      // For each store
      for (let store of Object.keys(this.store_item)) {
        // For each item
        for (let i = this.store_item[store].length - 1; i >= 0; i--) {
          stores[store].remove(this.store_item[store][i].key, this.store_item[store][i].uuid);
        }
      }
    }
    // Is not authenticated
    this.auth = false;
    this.kazoo = false
    // Has no store_items
    this.store_item = {}
  }
  /**
   * Sends some data from a given channel to the user if the user is authenticated
   * @param {string} channel channel to send to
   * @param {any} data what to send
   * @return {bool} true if the data was sent
   */
  send (channel, data) {
    if (this.auth) {
      this.socket.emit(channel, data);
      return true;
    }
    return false;
  }
  /**
   * Adds and registers a store
   * @param {string} store the name of the store
   * @param {string} key the key to subscribe to
   */
  addStore (store, key) {
    if (!this.store_item[store]) this.store_item[store] = [];
    this.store_item[store].push({
      key: key,
      uuid: stores[store].add(key, this)
    })
  }

  /**
   * Grabs the most recent messages from redis.
   * @param {int} numItems 
   */
  loadMessages(numItems) {
    redisClient.lrange( this.phoneNumber, 0, numItems, (error, messages) => { // Load messages on connect
      this.socket.emit('loadMessages', messages);
    })
  }
}
