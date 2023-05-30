import { execSync } from 'child_process';
import knex from 'knex';
import { getMongoClient } from './src/model/mongodb/mongoClient.js';

const {
  MONGO_NOTEFLOW_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_NOTEFLOW_PASSWORD,
} = process.env;

async function checkAccountExists() {
  // 連線到 MongoDB
  const client = getMongoClient();

  try {
    await client.connect();

    // 選擇要操作的資料庫和集合
    const database = client.db('admin');
    const collection = database.collection('system.users');

    // 使用 find() 方法進行查詢
    const query = { user: MONGO_NOTEFLOW_USERNAME, db: 'noteflow' };
    const result = await collection.find(query).toArray();

    // 檢查是否有符合的記錄
    if (result.length > 0) {
      console.log('帳號存在於 MongoDB 中');
    } else {
      console.log('帳號不存在於 MongoDB 中');
      execSync(
        `mongosh -u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD} --host ${MONGO_HOST} --port ${MONGO_PORT} --eval "db.getSiblingDB('noteflow').createUser({user: '${MONGO_NOTEFLOW_USERNAME}', pwd: '${MONGO_NOTEFLOW_PASSWORD}', roles: [{role: 'readWrite', db: 'noteflow'}]})"`,
      );
    }
  } catch (err) {
    console.error('發生錯誤:', err);
  }
}

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PORT,
  POSTGRES_PASSWORD,
} = process.env;

async function checkSchemaExists() {
  const k = knex({
    client: 'pg',
    connection: {
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
    },
  });

  try {
    const tableExists = await k.schema.hasTable('users');
    if (tableExists) {
      console.log('資料表 users 存在於 PostgreSQL 中');
    } else {
      console.log('資料表 users 不存在於 PostgreSQL 中');
      execSync('npm run db:migrate');
    }
  } catch (err) {
    console.error('發生錯誤:', err);
  }
}

// 呼叫函式檢查帳號是否存在

Promise.all([checkAccountExists(), checkSchemaExists()])
  .then(() => {
    // 兩個函式都完成後的後續處理程式碼
    console.log('完成檢查帳號和檢查資料表');
    process.exit(0);
  })
  .catch((err) => {
    console.error('發生錯誤:', err);
  });
