import CODE from '../../lib/httpStatus.js';
import Library from '../../model/mongodb/model/object/Library.js';

const removeNodeFromLibrary = async (ctx) => {
  const { id } = ctx.request.body;

  if (!id) {
    ctx.throw(CODE.insufficient);
  }

  try {
    await Library.removeNode(id, ctx.session.email);
    ctx.status = CODE.success;
  } catch {
    ctx.throw(CODE.internal_error);
  }
};

export default removeNodeFromLibrary;