import { Sms, Op } from "./cockroach";
export default class User {
  /**
   * Constructor for user
   * @param {any} socket the socket for this user
   */
  constructor(socket) {
    this.socket = socket;
  }
  /**
   * Login function
   * @param {Object} phoneNumber the phone number of the connected user
   * @param {number} ttl the time to live for this login
   */
  login(ttl) {
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
    this.socket.emit("status", {
      auth: false,
      reason: reason ? reason : false
    });
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
  /**
   * Grabs the most recent messages from redis.
   * @param {int} numItems
   */
  loadMessages(otherPhoneNumber, numItems) {
    Sms.findAll({
      where: {
        from_number: {
          [Op.or]: [this.phoneNumber, otherPhoneNumber]
        },
        to_number: {
          [Op.or]: [this.phoneNumber, otherPhoneNumber]
        },
      },
      order: [
        ['message_time', 'ASC']
      ]
    }).then((messages) => {
      this.socket.emit("messagesRetrieved", messages)
    }).catch((error) => {
      this.socket.emit("retrieveFailed", "Failed to retrieve message history")
    })
  }
}
