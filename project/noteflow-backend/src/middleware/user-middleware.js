import has from 'lodash/has';
import db from '../lib/db.js';

export default async (ctx, next) => {
  if (has(ctx, 'state.jwt.sub.id')) {
    // if ctx has state.jwt.sub.id;
    ctx.state.user = await db('users')
      .first('id', 'email', 'name', 'created_at', 'updated_at')
      .where({ id: ctx.state.jwt.sub.id });
  }

  return next();
};
