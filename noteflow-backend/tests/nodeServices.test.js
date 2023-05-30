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

const info2 = {
  email: 'test1234@gmail.com',
  password: crypto.SHA256('test123').toString(),
  name: 'test2',
};

const ghost = {
  email: '99999999999999999999999@gmail.com',
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

  it('api: /api/library', async () => {
    await instance.get('/api/library').send();
    const res = await instance.get(`/api/library`).send();

    expect(res.status).equal(200);
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

describe('colab list handling', () => {
  const instance1 = request.agent(server);
  const instance2 = request.agent(server);
  let nodeId1;

  before(async () => {
    let { name, email, password } = info;
    const getter1 = await k('users').first().where({ email });

    if (!getter1) {
      await instance1.post('/api/user/register').send({
        user: {
          name,
          email,
          password,
        },
      });
    }

    await instance1.post('/api/user/login').send({
      user: {
        name,
        email,
        password,
      },
    });

    ({ name, email, password } = info2);
    const getter2 = await k('users').first().where({ email });

    if (!getter2) {
      await instance2.post('/api/user/register').send({
        user: {
          name,
          email,
          password,
        },
      });
    }

    await instance2.post('/api/user/login').send({
      user: {
        name,
        email,
        password,
      },
    });
  });

  beforeEach(async () => {
    const res = await instance1.post('/api/nodes/new-node').send();
    nodeId1 = JSON.parse(res.text);
    console.log('node id:', nodeId1);
  });

  it('Revise colab list😎️🤩️', async () => {
    const res = await instance1
      .get(`/api/nodes/get-colab-list?id=${nodeId1}`)
      .expect(200)
      .send();
    const colabList = JSON.parse(res.text);
    expect(colabList.length).equal(1);

    const res2 = await instance1
      .post('/api/nodes/revise-colab-list')
      .expect(200)
      .send({
        id: nodeId1,
        colabs: [
          {
            email: info.email,
            type: 'original',
            status: 200,
          },
          {
            email: info2.email,
            type: 'new',
            status: 200,
          },
        ],
      });
    const result2 = JSON.parse(res2.text);
    result2.forEach((data) => {
      expect(data.status).equal(200);
    });
    expect(result2.length).equal(2);
  });

  it('Invited a ghost👻️👻️', async () => {
    const res = await instance1
      .post('/api/nodes/revise-colab-list')
      .expect(200)
      .send({
        id: nodeId1,
        colabs: [
          {
            email: info.email,
            type: 'original',
            status: 200,
          },
          {
            email: ghost.email,
            type: 'new',
            status: 200,
          },
        ],
      });

    const result = JSON.parse(res.text);

    let found = false;
    result.forEach((data) => {
      if (data.email === ghost.email) {
        found = true;
        expect(data.status).equal(404);
      }
    });

    expect(found).equal(true);
  });

  it('Remove a peer😠️😠️', async () => {
    await instance1
      .post('/api/nodes/revise-colab-list')
      .expect(200)
      .send({
        id: nodeId1,
        colabs: [
          {
            email: info.email,
            type: 'original',
            status: 200,
          },
          {
            email: info2.email,
            type: 'new',
            status: 200,
          },
        ],
      });

    const res = await instance1
      .post('/api/nodes/revise-colab-list')
      .expect(200)
      .send({
        id: nodeId1,
        colabs: [
          {
            email: info.email,
            type: 'original',
            status: 200,
          },
          {
            email: info2.email,
            type: 'remove',
            status: 200,
          },
        ],
      });

    const result = JSON.parse(res.text);

    let found = false;
    result.forEach((data) => {
      if (data.email === info.email) {
        found = true;
        expect(data.status).equal(200);
      }
    });

    expect(found).equal(true);

    const res3 = await instance1
      .get(`/api/nodes/get-colab-list?id=${nodeId1}`)
      .expect(200)
      .send();
    const colabList = JSON.parse(res3.text);
    expect(colabList.length).equal(1);
  });

  it('Remove the master😓️😓️', async () => {
    const res = await instance1
      .post('/api/nodes/revise-colab-list')
      .expect(200)
      .send({
        id: nodeId1,
        colabs: [
          {
            email: info.email,
            type: 'remove',
            status: 200,
          },
        ],
      });

    const result = JSON.parse(res.text);

    let found = false;
    result.forEach((data) => {
      if (data.email === info.email) {
        found = true;
        expect(data.status).equal(401);
      }
    });

    expect(result.length).equal(1);
    expect(found).equal(true);
  });
});
