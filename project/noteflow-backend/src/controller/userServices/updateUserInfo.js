/* eslint-disable import/no-extraneous-dependencies */
import _ from 'lodash';
import argon2 from 'argon2';
import db from '../../lib/db.js';
import { userSchema } from '../../model/postgres/schemas/index.js';

const updateUserInfo = async (ctx) => {
  const { body } = ctx.request;
  const { user: fields = {} } = body;
  const opts = { abortEarly: false, context: { validatePassword: false } };

  try {
    if (fields.password) {
      opts.context.validatePassword = true;
    }

    let user = { ...ctx.state.user, ...fields };

    user = await userSchema.validate(user, opts);

    if (fields.password) {
      user.password = await argon2.hash(user.password);
    }

    user.updatedAt = new Date().toISOString();

    await db('users').where('email', user.email).update({ name: user.name });

    ctx.logined = true;
    ctx.session.account = user.email;
    await ctx.session.save();

    ctx.body = { user: _.omit(user, ['password']) };
    ctx.status = 200;
  } catch (err) {
    ctx.throw(400, err.message);
    ctx.status = err.status || 500;
    ctx.body = JSON.parse({ errors: err.message });
  }
};

export default updateUserInfo;
