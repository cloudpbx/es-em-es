
export default class User {
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
    Sms.findAll({
      where: {
        from_number: {
          [Op.or]: [this.phoneNumber, otherPhoneNumber]
        },
        to_number: {
          [Op.or]: [this.phoneNumber, otherPhoneNumber]
        },
      }
    }).then((messages) => {
      console.log(messages);
      this.socket.emit("messagesRetrieved", messages)
    }).catch((error) => {
      this.socket.emit("retrieveFailed", "Failed to retrieve message history")
    })
  }
}
