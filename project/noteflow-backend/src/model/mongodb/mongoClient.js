import { MongoClient } from 'mongodb';

const {
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
} = process.env;

const mongoClient = new MongoClient(
  `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`,
  { minPoolSize: 8, useUnifiedTopology: true },
);
const getMongoClient = () => mongoClient;

export { getMongoClient };
