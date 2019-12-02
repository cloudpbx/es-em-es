var redisClient = require('redis-js');
var Q = require('q');

# Received

// Returns 'inbound' or 'outbound' depending on the presence of certain flags.
function messageType(data) {



    return Q
        .nfcall(redisClient.set, 'key', 'value')
        .then(function (reply) {
            if (reply !== 'OK') {
                throw new Error('reply not OK');
            }
            return Q.nfcall(redisClient.get, 'key');
        }, function (err) {
            throw err;
        })
        .then(function (reply) {
            if (reply !== 'value') {
                throw new Error('reply !== value');
            }
            return Q.nfcall(redisClient.del, 'key');
        }, function (err) {
            throw err;
        });
}
setGetDelQ()
    .fail(function (err) { throw err; })
    .done();