import CODE from '../../lib/httpStatus.js';
import { NodeRepo } from '../../model/mongodb/model/index.js';

const getNodeTitle = async (ctx) => {
  const { id } = ctx.query;

  if(!id) {
    ctx.throw(CODE.insufficient, 'You did not offer sufficient data');
  }

  let resolved;
  try {
    resolved = await NodeRepo.getTitle(id);
  } catch (e) {}

  ctx.status = resolved ? CODE.success : CODE.internal_error;
  ctx.body = JSON.stringify(resolved);
};

export default getNodeTitle;
