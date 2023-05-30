/* eslint-disable import/no-extraneous-dependencies */
import Koa from 'koa';
import { koaBody } from 'koa-body';

import logger from 'koa-logger';
import { WebSocketServer } from 'ws';
import http from 'http';

// import koaServe from 'koa-serve';
import koaStatic from 'koa-static';
import send from 'koa-send';
import cors from '@koa/cors';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import path from 'path';
import fs from 'fs';

import sharedb from './model/mongodb/sharedb.js';
import redisClient, { newRedisClient } from './model/redis/redisClient.js';
import routes from './routes/index.js';
import redisSession from './model/redis/redisSession.js';
import WsRouter from './routes/ws-router.js';
import { getMongoClient } from './model/mongodb/mongoClient.js';
import { Flows } from './model/mongodb/model/index.js';

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
  await next();
});

app.use(routes.routes());
app.use(koaStatic(path.join(process.cwd(), 'dist')));
app.use(async (ctx) => {
  console.log('root');
  await send(ctx, 'index.html', {
    root: path.join(process.cwd(), 'dist'),
    // setHeaders: (res) => {
    //   res.setHeader('Content-Type', 'application/javascript');
    // },
  });
});

const router = new WsRouter()
  .session('/node/registerNodeColab', (ws) => {
    ws.on('message', async (message) => {
      try {
        const query = JSON.parse(message.toString('utf-8'));
        await redisClient.set(
          `${query.nodeId}-${query.email}`,
          query.picture,
          'EX',
          3,
        );
        const keys = await redisClient.keys(`${query.nodeId}-*`);
        const value = await redisClient.mget(keys);

        ws.send(
          JSON.stringify(
            keys.map((entry, index) => ({
              entry,
              picture: value[index],
            })),
          ),
        );
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

    Flows.getTitle(channelName).then((title) => {
      ws.send(
        JSON.stringify({
          type: 's',
          title,
        }),
      );
    });

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
            type: 'p',
            email: ws.email,
            ...query,
          }),
        );
      });
    });
  })
  .session('/flow', (ws) => {
    // Flows.getTitle()
    ws.on('message', (message) => {
      const query = JSON.parse(message.toString('utf-8'));
      const { a, d } = query;
      if (a === 'op') {
        if (ws.prev) clearTimeout(ws.prev);
        // eslint-disable-next-line no-param-reassign
        ws.prev = setTimeout(() => {
          const mongoClient = getMongoClient();
          const collection = mongoClient.db('noteflow').collection('flows');
          const user = d.split('-')[0];
          collection.findOneAndUpdate(
            {
              user,
              'flows.id': d,
            },
            {
              $set: { 'flows.$.updateAt': Date.now() },
            },
          );
          clearTimeout(ws.prev);
        }, 2000);
      }
    });
    const stream = new WebSocketJSONStream(ws);
    sharedb.listen(stream);
  })
  .session('/node', (ws, can) => {
    ws.on('message', (message) => {
      const query = JSON.parse(message.toString('utf-8'));
      const { a, d } = query;
      if (!can && a === 'op') {
        ws.close();
      }
      if (a === 'op') {
        if (ws.prev) clearTimeout(ws.prev);
        // eslint-disable-next-line no-param-reassign
        ws.prev = setTimeout(() => {
          const mongoClient = getMongoClient();
          const collection = mongoClient
            .db('noteflow')
            .collection('nodeRepository');
          const user = d.split('-')[0];
          collection.findOneAndUpdate(
            {
              user,
              'nodes.id': d,
            },
            {
              $set: { 'nodes.$.updateAt': Date.now() },
            },
          );
          clearTimeout(ws.prev);
        }, 2000);
      }
    });

    const stream = new WebSocketJSONStream(ws);
    sharedb.listen(stream);
  })
  .session('/user-service', (ws) => {
    const redisListener = newRedisClient();
    const redisPublisher = newRedisClient();
    // const channelName = ws.params.get('id');

    // 喜歡你的 Node
    redisListener.subscribe(ws.email, (err) => {
      if (err) {
        ws.close(1001);
        return;
      }

      redisListener.on('message', (_, message) => {
        ws.send(message);
      });

      ws.on('message', async (message) => {
        // 推出去給大家
        const query = JSON.parse(message.toString('utf-8'));
        if (query && query.type) {
          const target = [query.id.split('-')[0]];

          target.forEach((person) => {
            redisPublisher.publish(
              person,
              JSON.stringify({
                source: ws.email,
                ...query,
              }),
            );
          });
        }
      });
    });
    // 進入了你的 Flow
    // 更改/刪除了你正在開啟的 Flow
  });

wsServer.on('connection', (ws, req) => {
  router.serve(ws, req);
});

server.listen(3000);

console.log('Listening!');

export default server;
