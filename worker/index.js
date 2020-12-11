const keys = require('./keys');
const redis = require('redis');

// Redis Client Setup --->
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000, // every 1 sec
});
const redisSubscriber = redisClient.duplicate();

redisSubscriber.on('message', (channel, message) => {
  console.log(`Redis Channel: ${channel}, message: ${message}`);

  // add "fibIndex with fibValue" to Redis
  redisClient.hset('values', message, fib(parseInt(message)));
});
redisSubscriber.on('error', (err) => {
  console.error('err: ', err);
});
redisSubscriber.subscribe('FIB_IDX_INSERT');

// calculate fib value
function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}
