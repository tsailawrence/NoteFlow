import CODE from '../../lib/httpStatus.js';
import Library from '../../model/mongodb/model/object/Library.js';

const removeNodeFromLibrary = async (ctx) => {
  let id = ctx.request.body ? ctx.request.body.id : undefined;

  if (!id) {
    ctx.throw(CODE.insufficient);
  }
  let resolved;
  try {
    resolved = await Library.removeNode(id, ctx.session.email);
  } catch {}

  ctx.status = resolved ? CODE.success : CODE.internal_error;
};

export default removeNodeFromLibrary;
