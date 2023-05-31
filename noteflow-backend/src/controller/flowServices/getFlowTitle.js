import CODE from '../../lib/httpStatus.js';
import { Flows } from '../../model/mongodb/model/index.js';

const getFlowTitle = async (ctx) => {
  const { id } = ctx.query;

  if (!id) {
    ctx.throw(CODE.insufficient, 'You did not offer sufficient data');
  }

  let resolved;
  try {
    resolved = await Flows.getTitle(id);
    ctx.status = CODE.success;
    ctx.body = JSON.stringify(resolved);
  } catch (e) {
    ctx.throw(CODE.internal_error, 'Internal server error');
  }
};

export default getFlowTitle;
