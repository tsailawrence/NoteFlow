import { Flow } from '../../model/mongodb/model/index.js';

const createFlow = async (ctx) => {
  const owner = ctx.session.email;

  try {
    const flowId = await Flow.generateFlowId(owner);
    const flow = new Flow(flowId, '', owner);
    await flow.newify();
    ctx.body = flowId;
    ctx.status = 200;
  } catch (err) {
    // 在 Model 階段出現任何錯誤
    ctx.throw(500, JSON.stringify(err));
  }
};

export default createFlow;
