/* eslint-disable import/no-extraneous-dependencies */
import humps from 'humps';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import argon2 from 'argon2';
import db from '../../lib/db.js';
import { createUserBucket } from '../../model/mongodb/model/index.js';

const googleLogin = async (ctx) => {
  const { user } = ctx.request.body;
  if (!user) {
    ctx.throw(400, "Bad request. You didn't provide user column.");
  }
  const userSelected = await db('users').first().where({ email: user.email });
  // return;

  if (!userSelected) {
    // 需要註冊才能登入
    user.uuid = uuidv4();
    user.password = await argon2.hash('google-login-no-password');

    await db('users').insert(
      humps.decamelizeKeys({
        uuid: user.uuid,
        email: user.email,
        picture: user.picture,
        password: user.password,
        name: `${user.name}`,
      }),
    );
    await createUserBucket(user.email);
  }

  user.name = `${user.name} ${user.family_name}`;

  ctx.session = {
    logined: true,
    email: user.email,
    name: user.name,
    picture: user.picture,
  };

  await ctx.session.save();

  ctx.body = JSON.stringify({ user: _.omit(user, ['password']) });
  ctx.status = 200;
};

export default googleLogin;
