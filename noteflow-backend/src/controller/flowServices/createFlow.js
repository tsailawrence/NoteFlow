import { Flow } from '../../model/mongodb/model/index.js';
import CODE from '../../lib/httpStatus.js';

const createFlow = async (ctx) => {
  const owner = ctx.session.email;

  let flowId;
  try {
    flowId = await Flow.generateFlowId(owner);
  } catch (err) {}

  if(flowId) {
    const flow = new Flow(flowId, '', owner);
    await flow.newify();
  }

  ctx.body = JSON.stringify(flowId);
  ctx.status = flowId ? CODE.success : CODE.internal_error;
};

export default createFlow;
