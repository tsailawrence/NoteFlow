import db from '../../lib/db.js';
import CODE from '../../lib/httpStatus.js';

const deleteUser = async (ctx) => {
  const { email } = ctx;
  await db('user').where({ email }).del();

  ctx.status = CODE.success;
};

export default deleteUser;
