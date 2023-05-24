import db from '../../lib/db.js';

const getUserPhoto = async (ctx) => {
  const { email } = ctx.session;

  const result = await db('users').first().where({ email });

  ctx.status = 200;
  ctx.body = result.picture;
};

export default getUserPhoto;
