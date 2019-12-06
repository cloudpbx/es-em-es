"use strict";
const Express = require("express");
const app = Express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "*:*" });
const router = Express.Router();
import { Sms, createSms, Op } from "./cockroach";
import User from "./User";

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
    let event;
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
    const payload = event.data.payload;
    let fromNumber;
    let toNumber;
    const text = payload.text;
    const id = payload.id;
    switch (event.data.event_type) {
      // Handle sent messages.
      case "message.sent":
        break;
      case "message.finalized":
        fromNumber = payload.from;
        toNumber = payload.to[0].phone_number;
        Sms.create(
          createSms(id, fromNumber, toNumber, text, payload)
        ).then((sms) => {
          if (fromNumber) {
            for (let user of phoneUser[fromNumber]) {
              user.send("sentFinalized", sms);
            }
          }
        }).catch((error) => {
          console.log(JSON.stringify(error))
          console.log("Sent message. failed to persist to database!!!!")
        })
        break;
      // Handle received messages.
      case "message.received":
        toNumber = payload.to;
        fromNumber = payload.from.phone_number;
        Sms.create(
          createSms(id, fromNumber, toNumber, text, payload)
        ).then((sms) => {
          if (toNumber) {
            for (let user of phoneUser[toNumber]) {
              user.send("receiveMessage", sms);
            }
          }
        }).catch((error) => {
          console.log("Received message, failed to persist to database!!!!")
        })
        break;
      // Lost and found.
      default:
        fromNumber = null;
        toNumber = null;
        console.error("Unknown event type. Data: `%s`.", event.data);
    }
    response.status(200).send("Signed Webhook Received: " + event.data.id);
  }
);

// Add webhook route to app.
app.use(router);

Sms.sync().then(
  () => {
    server.listen(8000, function() {
      console.log("SMS App listening on port 8000!");
    });
  }
)

// Manage connection/user
io.on("connection", socket => {
  console.log("New Connection");
  // Empty user
  socket._user = new User(socket);
  // Handle disconnect
  socket.on("disconnect", () => {
    if (socket._user.phoneNumber & phoneUser[socket._user.phoneNumber]) {
      phoneUser[socket._user.phoneNumber].delete(socket._user);
      delete socket._user;
    };
    console.log("Disconnected")
  });
  socket.on("phoneNumber", data => {
    socket._user.phoneNumber = data.phoneNumber;
    console.log(data.phoneNumber);
    if (!phoneUser[socket._user.phoneNumber]) {
      phoneUser[socket._user.phoneNumber] = new Set();
    }
    phoneUser[socket._user.phoneNumber].add(socket._user);
    socket._user.login(3600);
    socket._user.loadMessages('+16043551695')
  });
  socket.on("getMessages", data => {
    if (data.otherPhoneNumber) {
      socket._user.loadMessages(data.otherPhoneNumber, -1);
    } else {
      console.error("No other phone number was provided.");
    }
  });
  socket.on("sendMessage", data => {
    console.log("phoneNumber", socket._user.phoneNumber)
    telnyx.messages
      .create({
        from: socket._user.phoneNumber, // Your Telnyx number
        to: "+1" + data.number,
        text: data.message
      })
      .then(function(response) {
        const message = response.data;
        socket._user.send("sentMessage", message);
      })
      .catch(error => {
        console.log("Error in sending message: " + JSON.stringify(error));
        socket._user.send("sendFailed", "Failed to send message");
      })
  });
});

