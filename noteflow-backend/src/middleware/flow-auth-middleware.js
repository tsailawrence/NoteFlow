import { Flows, Node } from '../model/mongodb/model/index.js';
import CODE from '..//lib/httpStatus.js';

const authorized = async (ctx, next) => {
  let { id } = ctx.query;
  if (ctx.request.body && ctx.request.body.id) {
    id = ctx.request.body.id;
  }

  if (!id) {
    ctx.throw(CODE.insufficient, 'You did not offer sufficient data');
  }

  const path = ctx.request.url.split('/')[2];

  let colabs;
  if (path === 'flows') {
    colabs = await Flows.fetchColaborators(id.split('-')[0], id);
  } else {
    // 查看 'node' 的共編
    colabs = await Node.fetchColaborators(id.split('-')[0], id);
  }

  ctx.assert(colabs.includes(ctx.session.email), 401, 'Unauthorized.');

  ctx.colabs = colabs;
  return next();
};

export default authorized;
