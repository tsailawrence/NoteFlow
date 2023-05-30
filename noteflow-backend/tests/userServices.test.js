import request from 'supertest';
import knex from 'knex';
import server from '../src/app.js'
import { expect } from 'chai'
import crypto from 'crypto-js';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB
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
}

const googler = {
  email: 'test1234@gmail.com',
  name: 'test',
}

describe('user routine process', function () {

  before(async () => {
    const getter1 = await k("users").first().where({email: info.email});
    if(getter1){
      await k("users").where({email: info.email}).del();
    }

    const getter2 = await k("users").first().where({email: googler.email});
    if(getter2){
      await k("users").where({email: googler.email}).del();
    }
  });

  it('api: /api/user/register', async () => {
    const { name, email, password } = info;
    const res = await request(server)
      .post('/api/user/register')
      .send({
        user: {
          name,
          email,
          password,
        },
      });
    expect(res.status).equal(200);
  });


  it('api: /api/user/login', async () => {
    const { name, email, password } = info;
    const res = await request(server)
      .post('/api/user/login')
      .send({
        user: {
          name,
          email,
          password
        },
      });
    expect(res.status).equal(200);
  });

  it('api: /api/user/google-login(new comer)', async () => {
    const {name, email} = googler;
    const res = await request(server)
      .post('/api/user/google-login')
      .send({
        user: {
          email,
          name,
        },
      });
      expect(res.statusCode).equal(200);
  });

  it('api: /api/user/google-login(veteran)', async () => {
    const {name, email} = googler;
    const res = await request(server)
      .post('/api/user/google-login')
      .send({
        user: {
          email,
          name,
        },
      });
      expect(res.statusCode).equal(200);
  });
});

describe('REAL user service, session withregarding', function () {

  let instance = request.agent(server);

  before(async () => {
    const { name, email, password } = info;
    const getter1 = await k("users").first().where({email});

    if(!getter1){
      await request(server)
      .post('/api/user/register')
      .send({
        user: {
          name,
          email,
          password,
        },
      });
    }

    await instance
      .post('/api/user/login')
      .send({
        user: {
          name,
          email,
          password
        },
      });
  })

  it('api: /api/user/who-am-i', async () => {
    const res = await instance
    .get('/api/user/who-am-i')
    .send();

    expect(res.status).equal(200);
    expect(res.text).equal(`{"email":"test123@gmail.com","logined":true,"name":"test","picture":null}`)
  });

  it('api: /api/user/get-photo-url', async () => {

    const {email} = info;
    const res = await instance
    .get(`/api/user/get-photo-url?email=${email}`)
    .expect(200) // 設定期望的狀態碼
    .expect('Content-Type', 'application/json') // 設定期望的回應 Content-Type
    .send();

    expect(res.status).equal(200);
    expect(JSON.parse(res.text)).equal(null);
  });

  it('api: /api/user/set-photo', async () => {

    const res1 = await instance
    .post('/api/user/set-photo')
    .attach('image', `${process.cwd()}/tests/assets/yoshi.png`)

    const { email } = info;
    const res2 = await instance.get(`/api/user/get-photo-url?email=${email}`).send();
    

    expect(res1.status).equal(200, "set photo not succeeded");
    expect(res2.status).equal(200, "get photo not succeeded");

    expect(/^"test123@gmail.com/.test(res2.text)).equal(true);

    const res3 = await instance.get('/api/user/get-photo-url').send();
    
    expect(res3.text).equal(res2.text);
  });

  after(async () => {
    await instance.post('/api/user/logout').send();
  });
});
