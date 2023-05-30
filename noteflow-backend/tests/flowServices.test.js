import request from 'supertest';
import knex from 'knex';
import { expect } from 'chai';
import crypto from 'crypto-js';

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

const info = {
  email: 'test123@gmail.com',
  password: crypto.SHA256('test123').toString(),
  name: 'test',
};

describe('Flow init', () => {
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

  it('api: /api/flows/create', async () => {
    const res = await instance.post('/api/flows/create').send();
    expect(res.status).equal(200);
  });
});

describe('Real flow service🌼', () => {
  const instance = request.agent(server);
  let flowId;

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

    const res = await instance.post('/api/flows/create').send();
    console.log('new flow id:', res.text);
    flowId = JSON.parse(res.text);
  });

  it('api: /api/flows/get-colab-list', async () => {
    await instance.get('/api/flows/get-colab-list').expect(422).send();

    const res2 = await instance
      .get(`/api/flows/get-colab-list?id=${flowId}`)
      .send();
    expect(res2.status).equal(200);
    expect(res2.text).equal(`["${info.email}"]`);
  });

  // it('api: /api/flows/revise-colab-list', async () => {
  //   await instance.get('/api/nodes/get-colab-list').expect(422).send();
  // })

  it('api: /api/flows/get-title', async () => {
    await instance.get('/api/flows/get-title').expect(422).send();
    const res = await instance.get(`/api/flows/get-title?id=${flowId}`).send();

    expect(res.status).equal(200);
    expect(JSON.parse(res.text)).equal('Untitled');
  });

  it('api: /api/flows/set-title', async () => {
    const target = Math.random().toString(15);

    const res1 = await instance.post('/api/flows/set-title').send({
      id: flowId,
      title: target,
    });

    expect(res1.status).equal(200);

    const res2 = await instance.get(`/api/flows/get-title?id=${flowId}`).send();
    expect(JSON.parse(res2.text)).equal(target);
  });
});

describe('Delete Flows😶‍🌫️', () => {
  const instance = request.agent(server);
  let flowId;

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

    const res = await instance.post('/api/flows/create').send();
    flowId = JSON.parse(res.text);
  });

  it('api: /api/flows/delete-flow', async () => {
    await instance.post('/api/flows/delete-flow').expect(422).send();
    await instance.post('/api/flows/delete-flow').expect(200).send({
      id: flowId,
    });
  });
});
