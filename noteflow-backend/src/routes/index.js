import Router from 'koa-router';
import send from 'koa-send';
import path from 'path';
import users from './user-routes.js';
import swagger from './swagger-routes.js';

const router = new Router();

router.use('/api/swagger', swagger);
router.use('/api', users);
router.get('/api/fs/image/', async (ctx) => {
  const url = ctx.request.url.split('/');
  const image = url[url.length - 1];
  await send(ctx, image, { root: path.join(process.cwd(), 'images') });
});

export default router;
