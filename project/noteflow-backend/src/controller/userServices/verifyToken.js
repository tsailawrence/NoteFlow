/* eslint-disable import/no-extraneous-dependencies */
import _ from 'lodash';
import db from '../../lib/db.js';

const verifyToken = async (ctx) => {
  const { token, id } = ctx.query;
  try {
    const user = await db('users').first().where({ id });

    if (String(user.token).valueOf() === String(token).valueOf()) {
      await db('users')
        .where({ id })
        .update({
          verified: true,
        })
        .returning('*');

      ctx.session = {
        logined: true,
        email: user.email,
        name: user.name,
        picture: user.picture,
      };
      await ctx.session.save();

      const newUser = await db('users').first().where({ id });
      ctx.status = 200;
      ctx.body = { user: _.omit(newUser, ['password']) };
    }
  } catch (err) {
    ctx.throw(500, JSON.stringify({ errors: err.message }));
  }
};

export default verifyToken;
