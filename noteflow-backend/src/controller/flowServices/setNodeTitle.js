import CODE from '../../lib/httpStatus.js';
import { NodeRepo } from '../../model/mongodb/model/index.js';

const setNodeTitle = async (ctx) => {
  const { id, title } = ctx.request.body;

  let result;
  try {
    result = await NodeRepo.setTitle(id, title);
  } catch(e) {}

  ctx.status = result ? CODE.success : CODE.internal_error;
  ctx.body = JSON.stringify(result);
  
};

export default setNodeTitle;
