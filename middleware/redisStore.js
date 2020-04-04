const session = require('express-session');

const redis = require('redis');
const redisClient = redis.createClient();
const RedisStore = require('connect-redis')(session);

const redisStore = new RedisStore({ host: process.env.REDISHOST, port: 6379, client: redisClient, ttl: 86400 });


function getAllActiveSessions() {
    return new Promise((resolve, reject) => {
        redisStore.all(function(err, sessions) {
            if(err) reject(err);
            else resolve(sessions);
        });
    });
}

module.exports = { redisStore, getAllActiveSessions };