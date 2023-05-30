import CODE from '../../lib/httpStatus.js';
import { Flows } from '../../model/mongodb/model/index.js';

const deleteFlow = async (ctx) => {
  const id = ctx.request.body ? ctx.request.body.id : undefined ;

  ctx.assert(
    id.split('-')[0] === ctx.session.email,
    CODE.unauthorized,
    'You are not the owner of the flow.',
  );

  let modifiedCount;
  try {
    modifiedCount = await Flows.deleteFlow(id);
  } catch (err) {}

  ctx.body = id;
  ctx.status = modifiedCount === undefined ? CODE.internal_error : CODE.success;
  
};

export default deleteFlow;
