const Redis = require('ioredis');

const redis = new Redis("167.71.120.177", 6379, options={"password": "yJLT6Moy66AwvFwusmkGgHRXzSmYoTHUVG7luqnDvlpHfF6tEYY5Lb4b5dmbWS4i31EsTXj3cUn07Rs71CvcVvIaTKa4p0KCln6q1dtsGwIzbSCVXHW9QIMMXlYBBHb0glGESweTUoM9dwNt7MbvVAmKNzjN2h719HLUhwGJfHagyPGgpxGEsepsLUGXRHv8VrswHXR6B1bI0LvngU92FfiCn0hxqiOALlS4JtIDIjdRYkASkfk5XqBBiPk7PI35"});

redis.on('message', (channel, message) => {
    console.log(`Received the following message from ${channel}: ${message}`);
});

const channel = 'Incoming Messages';

redis.subscribe(channel, (error, count) => {
    if (error) {
        throw new Error(error);
    }
    console.log(`Subscribed to ${count} channel. Listening for updates on the ${channel} channel.`);
});