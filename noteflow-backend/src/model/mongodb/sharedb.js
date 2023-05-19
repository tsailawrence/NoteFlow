/* eslint-disable import/no-extraneous-dependencies */
import ShareDB from 'sharedb';
import richText from 'rich-text';
import json1 from 'ot-json1';
import sharedbMongo from 'sharedb-mongo';
import RedisPubSub from 'sharedb-redis-pubsub';

import redisClient from '../redis/redisClient.js';
import redisObserver from '../redis/redisObserver.js';

const {
  MONGO_NOTEFLOW_USERNAME,
  MONGO_NOTEFLOW_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB,
} = process.env;

ShareDB.types.register(json1.type);
ShareDB.types.register(richText.type); // allow sharedb to colab with rich text format
const sharedb = new ShareDB({
  presence: true,
  doNotForwardSendPresenceErrorsToClient: true,
  pubsub: RedisPubSub({ client: redisClient, observer: redisObserver }),
  db: sharedbMongo(
    `mongodb://${MONGO_NOTEFLOW_USERNAME}:${MONGO_NOTEFLOW_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`,
    { useUnifiedTopology: true, maxPoolSize: 10, useNewUrlParser: true },
  ),
});

export default sharedb;
