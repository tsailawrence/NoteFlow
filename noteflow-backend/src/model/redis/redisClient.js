import Redis from 'ioredis';

const { REDIS_HOST, REDIS_PORT } = process.env;

// initialize redis client
const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

const newRedisClient = () =>
  new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
  });

export default redisClient;
export { newRedisClient };
