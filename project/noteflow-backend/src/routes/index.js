import Router from 'koa-router';
import users from './user-routes.js';
import swagger from './swagger-routes.js';

const router = new Router();

router.use('/api/swagger', swagger);
router.use('/api', users);

export default router;
