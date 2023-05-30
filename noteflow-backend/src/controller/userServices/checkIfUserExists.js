import db from '../../lib/db.js';
import CODE from '../../lib/httpStatus.js';

const checkIfUserExist = async (ctx) => {
  const { email } = ctx;

  const result = await db('users').first().where({ email });
  ctx.status = CODE.success;
  ctx.body = !!result;
};

export default checkIfUserExist;
