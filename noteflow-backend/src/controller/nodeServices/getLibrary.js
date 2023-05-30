import CODE from '../../lib/httpStatus.js';
import Library from '../../model/mongodb/model/object/Library.js';

const getLibrary = async (ctx) => {
  let nodes;
  try {
    nodes = await Library.fetchNodes(ctx.session.email);
  } catch (err) {}

  ctx.status = nodes ? CODE.success : CODE.internal_error;
  ctx.body = JSON.stringify(nodes);
};

export default getLibrary;
