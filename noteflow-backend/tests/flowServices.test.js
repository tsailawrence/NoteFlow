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

const info2 = {
  email: 'test1234@gmail.com',
  password: crypto.SHA256('test123').toString(),
  name: 'test2',
};

const ghost = {
  email: '99999999999999999999999@gmail.com',
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

  it('api: /api/flows(empty)', async () => {
    // await instance.get('/api/flows').expect(422).send();

    const res2 = await instance.get(`/api/flows`).send();
    expect(res2.status).equal(204);
  });

  it('api: /api/flows/get-colab-list', async () => {
    await instance.get('/api/flows/get-colab-list').expect(422).send();

    const res2 = await instance
      .get(`/api/flows/get-colab-list?id=${flowId}`)
      .send();
    expect(res2.status).equal(200);
    expect(res2.text).equal(`["${info.email}"]`);
  });

  it('api: /api/flows/revise-colab-list(insufficient)', async () => {
    await instance.get('/api/nodes/get-colab-list').expect(422).send();

    const res2 = await instance.post(`/api/flows/revise-colab-list`).send();
    expect(res2.status).equal(422);
  });

  it('api: /api/flows/get-title(error)', async () => {
    await instance.get('/api/flows/get-title').expect(422).send();
    const res = await instance.get(`/api/flows/get-title?id=-1`).send();

    expect(res.status).equal(500);
  });

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

describe('colab list handling', () => {
  const instance1 = request.agent(server);
  const instance2 = request.agent(server);
  let flowId1;

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
    const res = await instance1.post('/api/flows/create').send();
    flowId1 = JSON.parse(res.text);
    console.log('flow id:', flowId1);
  });

  it('Revise colab list😎️🤩️', async () => {
    const res = await instance1
      .get(`/api/flows/get-colab-list?id=${flowId1}`)
      .expect(200)
      .send();
    const colabList = JSON.parse(res.text);
    expect(colabList.length).equal(1);

    const res2 = await instance1
      .post('/api/flows/revise-colab-list')
      .expect(200)
      .send({
        id: flowId1,
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
      .post('/api/flows/revise-colab-list')
      .expect(200)
      .send({
        id: flowId1,
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
      .post('/api/flows/revise-colab-list')
      .expect(200)
      .send({
        id: flowId1,
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
      .post('/api/flows/revise-colab-list')
      .expect(200)
      .send({
        id: flowId1,
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
      .get(`/api/flows/get-colab-list?id=${flowId1}`)
      .expect(200)
      .send();
    const colabList = JSON.parse(res3.text);
    expect(colabList.length).equal(1);
  });

  it('Remove the master😓️😓️', async () => {
    const res = await instance1
      .post('/api/flows/revise-colab-list')
      .expect(200)
      .send({
        id: flowId1,
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
