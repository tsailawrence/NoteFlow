import CODE from '../../lib/httpStatus.js';
import Library from '../../model/mongodb/model/object/Library.js';

const isFavorite = async (ctx) => {
  const { id } = ctx.query;
  if (!id) {
    ctx.throw(CODE.insufficient);
  }

  let isFav;
  try {
    isFav = await Library.isFavorite(ctx.session.email, id);
  } catch {}

  ctx.status = isFav === true || isFav === false ? CODE.success : CODE.internal_error;
  ctx.body = JSON.stringify(isFav);
  
};

export default isFavorite;
