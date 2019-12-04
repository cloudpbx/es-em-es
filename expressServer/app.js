"use strict";

const Express = require("express");

const app = Express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "*:*" });
const router = Express.Router();

// Define redis client.
var redis = require("redis");
const redisPass =
  "yJLT6Moy66AwvFwusmkGgHRXzSmYoTHUVG7luqnDvlpHfF6tEYY5Lb4b5dmbWS4i31EsTXj3cUn07Rs71CvcVvIaTKa4p0KCln6q1dtsGwIzbSCVXHW9QIMMXlYBBHb0glGESweTUoM9dwNt7MbvVAmKNzjN2h719HLUhwGJfHagyPGgpxGEsepsLUGXRHv8VrswHXR6B1bI0LvngU92FfiCn0hxqiOALlS4JtIDIjdRYkASkfk5XqBBiPk7PI35";
const redisClient = redis.createClient();
redisClient.auth(redisPass);
redisClient.on("error", err => {
  console.log("Error " + err);
});

// Define Telnyx stuff.
const telnyx = require("telnyx")(
  "KEY016EC7DF1D08F8D9FEC2FCE0263B0811_LpK2t8vlrGx2TypnqsfrZz"
);
const publicKey = "6JHIzNE/VcU3l6M6GJMhUaHURMJJIbRKL6CCE+e1QUg=";

var phoneUser = {};

// Receive webhooks from telnyx, and push them to sockets.
function addRawBody(req, res, next) {
  req.setEncoding("utf8");

  var data = "";

  req.on("data", function(chunk) {
    data += chunk;
  });

  req.on("end", function() {
    req.rawBody = data;

    next();
  });
}
router.post(
  "/webhook/oV2KDfSKNQb1SRMGsRzJ",
  addRawBody,
  (request, response) => {
    var event;
    var phoneNumber;
    try {
      event = telnyx.webhooks.constructEvent(
        request.rawBody,
        request.header("telnyx-signature-ed25519"),
        request.header("telnyx-timestamp"),
        publicKey
      );
    } catch (e) {
      console.log("Error", e.message);
      return response.status(400).send("Webhook Error:" + e.message);
    }

    // Send the message to the right channel based on the from or to number and the event type.
    switch (event.data.event_type) {
      // Handle sent messages.
      case "message.sent":
        return;
      case "message.finalized":
        phoneNumber = event.data.payload.from;
        redisClient.rpush(
          phoneNumber + "|" + event.data.payload.to[0].phone_number,
          JSON.stringify(event.data)
        );
        if (phoneNumber) {
          for (let user of phoneUser[phoneNumber]) {
            user.send("sentFinalized", event.data);
          }
        }
        break;
      // Handle received messages.
      case "message.received":
        phoneNumber = event.data.payload.to;
        redisClient.rpush(
          phoneNumber + "|" + event.data.payload.from.phone_number,
          JSON.stringify(event.data)
        );
        if (phoneNumber) {
          for (let user of phoneUser[phoneNumber]) {
            user.send("receiveMessage", event.data);
          }
        }
        break;
      // Lost and found.
      default:
        phoneNumber = null;
        console.error("Unknown event type. Data: `%s`.", event.data);
    }
    response.status(200).send("Signed Webhook Received: " + event.data.id);
  }
);

// Add webhook route to app.
app.use(router);

server.listen(8000, function() {
  console.log("SMS App listening on port 8000!");
});

// Manage connection/user
io.on("connection", socket => {
  console.log("New Connection");
  // Empty user
  socket._user = new User(socket);
  // Handle disconnect
  socket.on("disconnect", () => {
    socket._user.clear();
    phoneUser[socket._user.phoneNumber].delete(socket._user);
    delete socket._user;
  });
  socket.on("phoneNumber", data => {
    socket._user.phoneNumber = data.phoneNumber;
    if (!phoneUser[socket._user.phoneNumber]) {
      phoneUser[socket._user.phoneNumber] = new Set();
    }
    phoneUser[socket._user.phoneNumber].add(socket._user);
    socket._user.login(3600);
  });
  socket.on("getMessages", data => {
    if (data.otherPhoneNumber) {
      socket._user.loadMessages(data.otherPhoneNumber, -1);
    } else {
      console.error("No other phone number was provided.");
    }
  });
  socket.on("sendMessage", data => {
    telnyx.messages
      .create({
        from: socket._user.phoneNumber, // Your Telnyx number
        to: "+1" + data.number,
        text: data.message
      })
      .then(function(response) {
        const message = response.data;
        socket.emit("sentMessage", message);
      })
      .catch(error => {
        console.log("Error in sending message: " + JSON.stringify(error));
        socket.emit("error", "Failed to send message");
      })
      .error("Error in sending message: " + JSON.stringify(error));
  });
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
   * @param {Object} phoneNumber the phone number of the connected user
   * @param {number} ttl the time to live for this login
   */
  login(ttl) {
    this.clear();
    // Complete the login
    this.auth = true;
    // Let the user know of the successful authentication
    this.socket.emit("status", {
      auth: true,
      ttl: ttl,
      permissions: this.permissions
    });
    // Prepare to logout the user
    setTimeout(() => {
      this.logout(`Your key has expired`);
    }, (ttl - 1) * 1000);
  }
  /**
   * Logout function
   * @param {string=} reason an optional reason for logging out the user
   */
  logout(reason) {
    this.clear();
    this.socket.emit("status", {
      auth: false,
      reason: reason ? reason : false
    });
  }
  /**
   * Clears the user (effectively a shadow logout)
   */
  clear() {
    var stores;
    // If it has any active store
    if (this.store_item) {
      // For each store
      for (let store of Object.keys(this.store_item)) {
        // For each item
        for (let i = this.store_item[store].length - 1; i >= 0; i--) {
          stores[store].remove(
            this.store_item[store][i].key,
            this.store_item[store][i].uuid
          );
        }
      }
    }
    // Is not authenticated
    this.auth = false;
    this.kazoo = false;
    // Has no store_items
    this.store_item = {};
  }
  /**
   * Sends some data from a given channel to the user if the user is authenticated
   * @param {string} channel channel to send to
   * @param {any} data what to send
   * @return {bool} true if the data was sent
   */
  send(channel, data) {
    if (this.auth) {
      this.socket.emit(channel, data);
      return true;
    }
    return false;
  }
  // /**
  //  * Adds and registers a store
  //  * @param {string} store the name of the store
  //  * @param {string} key the key to subscribe to
  //  */
  // addStore(store, key) {
  //   if (!this.store_item[store]) this.store_item[store] = [];
  //   this.store_item[store].push({
  //     key: key,
  //     uuid: stores[store].add(key, this)
  //   });
  // }

  /**
   * Grabs the most recent messages from redis.
   * @param {int} numItems
   */
  loadMessages(otherPhoneNumber, numItems) {
    redisClient.lrange(
      this.phoneNumber + "|" + otherPhoneNumber,
      0,
      numItems,
      (error, messages) => {
        // Load messages on connect
        this.socket.emit("getMessages" + "|" + otherPhoneNumber, messages);
      }
    );
  }
}
