import request from 'supertest';
import knex from 'knex';
import { expect } from 'chai';
import crypto from 'crypto-js';
import { MongoClient } from 'mongodb';
import server from '../src/app.js';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

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

const info = {
  email: 'test123@gmail.com',
  password: crypto.SHA256('test123').toString(),
  name: 'test',
};

describe('Node init', () => {
  const instance = request.agent(server);

  before(async () => {
    const { name, email, password } = info;
    const getter1 = await k('users').first().where({ email });

    if (!getter1) {
      await request(server).post('/api/user/register').send({
        user: {
          name,
          email,
          password,
        },
      });
    }

    await instance.post('/api/user/login').send({
      user: {
        name,
        email,
        password,
      },
    });
  });

  it('api: /api/nodes/new-node', async () => {
    const res = await instance.post('/api/nodes/new-node').send();
    expect(res.status).equal(200);
  });
});

describe('Node service', () => {
  const instance = request.agent(server);
  let nodeId;

  before(async () => {
    const { name, email, password } = info;
    const getter1 = await k('users').first().where({ email });

    if (!getter1) {
      await request(server).post('/api/user/register').send({
        user: {
          name,
          email,
          password,
        },
      });
    }

    await instance.post('/api/user/login').send({
      user: {
        name,
        email,
        password,
      },
    });

    const res = await instance.post('/api/nodes/new-node').send();
    nodeId = JSON.parse(res.text);
  });

  it('api: /api/nodes/get-colab-list', async () => {
    await instance.get('/api/nodes/get-colab-list').expect(422).send();

    const res2 = await instance
      .get(`/api/nodes/get-colab-list?id=${nodeId}`)
      .send();
    expect(res2.status).equal(200);
    expect(res2.text).equal(`["${info.email}"]`);
  });

  // it('api: /api/nodes/revise-colab-list', async () => {
  //   await instance.get('/api/nodes/get-colab-list').expect(422).send();
  // })

  it('api: /api/nodes/get-title', async () => {
    await instance.get('/api/nodes/get-title').expect(422).send();
    const res = await instance.get(`/api/nodes/get-title?id=${nodeId}`).send();

    expect(res.status).equal(200);
    expect(JSON.parse(res.text)).equal('Untitled');
  });

  it('api: /api/nodes/set-title', async () => {
    const target = Math.random().toString(15);

    const res1 = await instance.post('/api/nodes/set-title').send({
      id: nodeId,
      title: target,
    });

    expect(res1.status).equal(200);

    const res2 = await instance.get(`/api/nodes/get-title?id=${nodeId}`).send();
    expect(JSON.parse(res2.text)).equal(target);
  });
});

describe('Library functionality test', () => {
  const instance = request.agent(server);
  let nodeId;

  before(async () => {
    const { name, email, password } = info;
    const getter1 = await k('users').first().where({ email });

    if (getter1) {
      await k('users').where({ email: info.email }).del();

      await mongoClient.connect();

      const db = mongoClient.db('noteflow');
      await db.collection('flowList').findOneAndDelete({
        user: email,
      });
      await db.collection('flows').findOneAndDelete({
        user: email,
      });
      await db.collection('library').findOneAndDelete({
        user: email,
      });
      await db.collection('nodeRepository').findOneAndDelete({
        user: email,
      });
    }

    await request(server).post('/api/user/register').send({
      user: {
        name,
        email,
        password,
      },
    });

    await instance.post('/api/user/login').send({
      user: {
        name,
        email,
        password,
      },
    });

    const res = await instance.post('/api/nodes/new-node').send();
    nodeId = JSON.parse(res.text);
  });

  it('api: /api/library/is-favorite', async () => {
    await instance.get('/api/library/is-favorite').expect(422).send();
    const res = await instance
      .get(`/api/library/is-favorite?id=${nodeId}`)
      .send();

    expect(res.status).equal(200);
    expect(JSON.parse(res.text)).equal(false);
  });

  it('api: /api/library/add-node', async () => {
    await instance.post('/api/library/add-node').expect(422).send();
    await instance.post('/api/library/add-node').expect(200).send({
      id: nodeId,
    });
    const res = await instance
      .get(`/api/library/is-favorite?id=${nodeId}`)
      .send();

    expect(res.status).equal(200);
    expect(JSON.parse(res.text)).equal(true);
  });

  it('api: /api/library/remove-node', async () => {
    await instance.post('/api/library/add-node').expect(200).send({
      id: nodeId,
    });
    const res1 = await instance
      .get(`/api/library/is-favorite?id=${nodeId}`)
      .send();

    expect(res1.status).equal(200);
    expect(JSON.parse(res1.text)).equal(true);

    await instance.post('/api/library/remove-node').expect(422).send();
    await instance.post('/api/library/remove-node').expect(200).send({
      id: nodeId,
    });

    const res2 = await instance
      .get(`/api/library/is-favorite?id=${nodeId}`)
      .send();

    expect(res2.status).equal(200);
    expect(JSON.parse(res2.text)).equal(false);
  });
});
