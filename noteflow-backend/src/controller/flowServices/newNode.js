import CODE from '../../lib/httpStatus.js';
import { NodeRepo } from '../../model/mongodb/model/index.js';

const newNode = async (ctx) => {
  let nodeId;
  // try {
  nodeId = await NodeRepo.newNode(ctx.session.email);
  // } catch (e) {}

  ctx.body = JSON.stringify(nodeId);
  ctx.status = nodeId ? CODE.success : CODE.internal_error;
};

export default newNode;
