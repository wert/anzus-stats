const redis = require('redis');
const {RateLimiterRedis} = require('rate-limiter-flexible');

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
  enable_offline_queue: false
});

const rateLimiter = new RateLimiterRedis({
  redis: redisClient,
  keyPrefix: 'middleware',
  points: 15, // 20 requests
  duration: 1, // per 1 second by IP
  inmemoryBlockOnConsumed: 15,
});

const Limiter = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
        next();
    })
    .catch((err) => {
      console.log(err)
        res.status(429).send('Too Many Requests');
    });
};

module.exports = Limiter;
