import CODE from '../../lib/httpStatus.js';
import Library from '../../model/mongodb/model/object/Library.js';

const addNodeToLibrary = async (ctx) => {
  let id = ctx.request.body ? ctx.request.body.id : undefined;

  if (!id) {
    ctx.throw(CODE.insufficient);
  }

  let result;
  try {
    result = await Library.addNode(id, ctx.session.email);
  } catch {}

  ctx.status = result === true || result === false ? CODE.success : CODE.internal_error;
  ctx.body = JSON.stringify(result)
};

export default addNodeToLibrary;
