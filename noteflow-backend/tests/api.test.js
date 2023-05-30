import server from '../src/app.js';
import request from 'supertest';
import { expect } from 'chai'

describe('api: /api/swagger', function () {
  it('api: /api/hello-world', async () => {
      const res = await request(server).get('/api/hello-world').send()
      // console.log(res)
      expect(res.status).equal(200);
      expect(res.text).equal('hello world!');
  })
  it('api: /api/swagger', async () => {
    const res = await request(server).get('/api/swagger').send();
    expect(res.status).equal(200);
  });

  it('api: /not-found', async () => {
    const res = await request(server).get('/not-found').send();
    expect(res.status).equal(404);
  });

  it('api: /api/not-found', async () => {
    const res = await request(server).get('/api/not-found').send();
    expect(res.status).equal(404);
  });

  it('api: /api/reset-redis', async () => {
    const res = await request(server)
      .get('/api/reset-redis')
      .send();
      expect(res.status).equal(200);
  });
});
