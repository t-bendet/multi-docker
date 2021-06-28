const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  // config the redis client that in case of disconnection to the redis server try to connect every second
  retry_strategy: () => 1000,
});

// duplicate redisClient
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// run CB on new message,then insert it into a hash of values
// message is the index and the key for the hash of values
sub.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message)));
});

// any time a value is inserted into redis ,get that value and calculate
sub.subscribe("insert");
