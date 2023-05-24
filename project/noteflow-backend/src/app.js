/* eslint-disable import/no-extraneous-dependencies */
import Koa from 'koa';
import { koaBody } from 'koa-body';

import logger from 'koa-logger';
import { WebSocketServer } from 'ws';
import https from 'https';
import http from 'http';
import koaSslify from 'koa-sslify';

import cors from '@koa/cors';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import path from 'path';
import fs from 'fs';
import send from 'koa-send';

import sharedb from './model/mongodb/sharedb.js';
import redisClient, { newRedisClient } from './model/redis/redisClient.js';
import routes from './routes/index.js';
import redisSession from './model/redis/redisSession.js';
import WsRouter from './routes/ws-router.js';

const app = new Koa();

if (!fs.existsSync(path.join(process.cwd(), 'images'))) {
  fs.mkdirSync(path.join(process.cwd(), 'images'));
}

app.use(logger());
app.use(
  cors({
    origin: '*',
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type'],
    exposeHeaders: [
      'Authorization',
      'set-cookie',
      'access-control-allow-origin',
      'access-control-allow-credentials',
    ],
    keepHeadersOnError: true,
  }),
);

app.use(redisSession(app));

app.use(koaBody());
app.use(routes.allowedMethods());

const server = http.createServer(app.callback());

const wsServer = new WebSocketServer({ server });

app.use(async (ctx, next) => {
  if (server instanceof http.Server) {
    const { user } = ctx.request.body;
    ctx.session = user ? { ...user } : ctx.session;
  }
  await next();
});

app.use(routes.routes());
// app.use(koaServe({ rootPath: '/', rootDir: 'images' }));
// app.use(koaStatic(path.join(process.cwd(), 'images')));
app.use(async (ctx) => {
  const url = ctx.request.url.split('/');
  const image = url[url.length - 1];
  await send(ctx, image, { root: path.join(process.cwd(), 'images') });
});

const router = new WsRouter()
  .no_session('/registerNodeColab', (ws) => {
    ws.on('message', async (message) => {
      try {
        const query = JSON.parse(message.toString('utf-8'));
        await redisClient.set(`${query.nodeId}-${query.email}`, 1, 'EX', 3);
        const keys = await redisClient.keys(`${query.nodeId}-*`);
        ws.send(JSON.stringify(keys));
      } catch (e) {
        ws.close(1001);
      }
    });
  })
  .session('/flow/mouse-sub', (ws) => {
    // 上面的 ws 會一直都是原本的那一個，所以可以直接在上面加入 ws.email = email
    const redisListener = newRedisClient();
    const redisPublisher = newRedisClient();
    const channelName = ws.params.get('id');

    // 訂閱 Redis, 讓我們可以收到同一個 Flow 中其他用戶的訊息
    redisListener.subscribe(channelName, (err) => {
      if (err) {
        ws.close(1001);
        return;
      }
      // 直接轉送其他用戶的位置
      redisListener.on('message', (_, message) => {
        ws.send(message);
      });

      // 跟前端 bind 住，讓後端可以收到來自特定用戶的訊息，以發送給 Channel 上其他人
      ws.on('message', async (message) => {
        // 每次他們送 x, y 來的時候, 還會送到指定的 channel 上（nodeId）
        const query = JSON.parse(message.toString('utf-8'));
        await redisPublisher.publish(
          channelName,
          JSON.stringify({
            email: ws.email,
            ...query,
          }),
        );
      });
    });
  })
  .session('/flow', (ws) => {
    const stream = new WebSocketJSONStream(ws);
    sharedb.listen(stream);
  })
  .no_session('/node', (ws) => {
    const stream = new WebSocketJSONStream(ws);
    sharedb.listen(stream);
  });

wsServer.on('connection', (ws, req) => {
  router.serve(ws, req);
});

server.listen(3000);

console.log('Listening!');

export default server;
