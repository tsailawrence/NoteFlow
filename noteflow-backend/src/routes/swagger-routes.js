/* eslint-disable import/no-extraneous-dependencies */
import Router from 'koa-router';
import { koaSwagger } from 'koa2-swagger-ui';
import yamljs from 'yamljs';
import path from 'path';

const router = new Router();

const spec = yamljs.load(path.resolve('config/swagger.yaml'));

router.get(
  '/',
  koaSwagger({
    favicon: '/swagger.png',
    routePrefix: false,
    swaggerOptions: { spec },
  }),
);

export default router.routes();
