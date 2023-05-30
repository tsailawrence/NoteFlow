import { Flows } from '../../model/mongodb/model/index.js';
import CODE from '../../lib/httpStatus.js';

const setFlowTitle = async (ctx) => {
  const { id, title } = ctx.request.body;
  console.log('set flow title')

  let result;
  try {
    result = await Flows.setTitle(id, title);
  } catch (e) {}

  ctx.status = result ? CODE.success : CODE.internal_error;
  ctx.body = JSON.stringify(result);
};

export default setFlowTitle;
