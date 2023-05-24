import Redis from 'ioredis';

const { REDIS_HOST, REDIS_PORT } = process.env;

// initialize redis observer
const redisObserver = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

export default redisObserver;
