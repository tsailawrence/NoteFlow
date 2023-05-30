import { Flow } from '../../model/mongodb/model/index.js';
import CODE from '../../lib/httpStatus.js';

const createFlow = async (ctx) => {
  const owner = ctx.session.email;

  let flowId;
  try {
    flowId = await Flow.generateFlowId(owner);
  } catch (err) {}

  let success;
  if (flowId) {
    console.log('newify!!');
    success = await Flow.newify(flowId);
  }

  ctx.body = JSON.stringify(flowId);
  ctx.status = success && flowId ? CODE.success : CODE.internal_error;
};

export default createFlow;
