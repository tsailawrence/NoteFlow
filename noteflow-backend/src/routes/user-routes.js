/* eslint-disable import/no-extraneous-dependencies */
import Router from 'koa-router';
import multer from '@koa/multer';
import { user, flow, node } from '../controller/index.js';
import logined from '../middleware/logined-middleware.js';
import authorized from '../middleware/flow-auth-middleware.js';
import redisClient from '../model/redis/redisClient.js';

const upload = multer();

const router = new Router();
router
  .get('/hello-world', async (ctx) => {
    ctx.session.hello = 'hi';
    await ctx.session.save();

    ctx.body = 'hello world!';
    ctx.status = 200;
  })
  .get('/reset-redis', async (ctx) => {
    await redisClient.flushall();
    ctx.status = 200;
  })
  .post('/user/login', user.login)
  .post('/user/logout', user.logout)
  .post('/user/register', user.register)
  .post('/user/google-login', user.googleLogin)
  .get('/user/who-am-i', user.whoAmI)
  .post(
    '/user/set-photo',
    logined,
    upload.fields([
      {
        name: 'image',
        maxCount: 1,
      },
    ]),
    user.setUserPhoto,
  )
  .get('/user/get-photo-url', user.getUserPhoto)
  .post('/user/reset-password-send-email', user.forgotPassword)
  .post('/user/reset-password-auth', user.forgotPasswordAuth)
  .post('/user/reset-password-renew', user.forgotPasswordRenew)
  .get('/flows', logined, flow.getFlows)
  .post('/flows/create', logined, flow.createFlow)
  .post('/flows/delete-flow', logined, authorized, flow.deleteFlow)
  .get('/flows/get-colab-list', logined, authorized, flow.getColabList)
  .post('/flows/revise-colab-list', logined, authorized, flow.reviseColabList)
  .get('/flows/get-title', logined, flow.getFlowTitle)
  .post('/flows/set-title', logined, authorized, flow.setFlowTitle)
  .get('/library', logined, node.getLibrary)
  .get('/library/is-favorite', logined, node.isFavorite)
  .post('/library/add-node', logined, node.addNodeToLibrary)
  .post('/library/remove-node', logined, node.removeNodeFromLibrary)
  .post('/nodes/new-node', logined, flow.newNode)
  .get('/nodes/get-colab-list', logined, authorized, flow.getColabList)
  .post('/nodes/revise-colab-list', logined, authorized, flow.reviseColabList)
  .get('/nodes/get-title', logined, flow.getNodeTitle)
  .post('/nodes/set-title', logined, authorized, flow.setNodeTitle);

// 我有改一些 route 的名字.

export default router.routes();
