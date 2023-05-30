import CODE from '../../lib/httpStatus.js';
import FlowList from '../../model/mongodb/model/object/FlowList.js';
import Flows from '../../model/mongodb/model/object/Flows.js';

const getFlows = async (ctx) => {
  // 拿取你帳號裡面的所有 Flows
  const { page } = ctx.request.query;

  let result;
  try {
    const flowList = await FlowList.fetchFlowList(ctx.session.email);
    result = await Flows.fetchFlowsByFlowList(flowList, page);
  } catch (err) {}

  ctx.status = result ? CODE.success : CODE.internal_error;
  ctx.body = JSON.stringify(result);
};

export default getFlows;
