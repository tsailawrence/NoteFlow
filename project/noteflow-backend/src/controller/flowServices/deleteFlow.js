import { Flow } from '../../model/mongodb/model/index.js';

const deleteFlow = async (ctx) => {
  const { flowId } = ctx.request.body;

  ctx.assert(
    flowId.split('-')[0] === ctx.session.email,
    401,
    'You are not the owner of the flow.',
  );

  try {
    await Flow.deleteFlow(flowId);
    ctx.body = flowId;
    ctx.status = 200;
  } catch (err) {
    // 在 Model 階段出現任何錯誤
    ctx.throw(500, JSON.stringify(err));
  }
};

export default deleteFlow;
