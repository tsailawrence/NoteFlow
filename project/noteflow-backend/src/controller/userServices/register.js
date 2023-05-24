/* eslint-disable import/no-extraneous-dependencies */
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import argon2 from 'argon2';
import crypto from 'crypto-js';
import db from '../../lib/db.js';
import sendEmail from '../../lib/email.js';
import HTML_TEMPLATE from '../../lib/mail-template.js';
import { createUserBucket } from '../../model/mongodb/model/index.js';

const { EMAIL_USER, EMAIL_HOST } = process.env;

const register = async (ctx) => {
  const { user } = ctx.request.body; // if none, assign user with {}

  ctx.assert(user, 400, "Bad request. You didn't provide user column.");

  const filled = user.email && user.name && user.password;
  ctx.assert(
    filled,
    400,
    "Bad request. You didn't provide sufficient information.",
  );

  // create User
  const result = await db('users').first().where({ email: user.email });
  ctx.assert(result, 401, 'Forbidden, you already have an email.');

  let userId = null;
  const randomString = Math.random().toString(15);
  const token = crypto.SHA256(randomString).toString(crypto.enc.Hex);
  const password = await argon2.hash(user.password);

  try {
    await db('users')
      .insert({
        uuid: uuidv4(),
        name: user.name,
        password,
        email: user.email,
        token,
      })
      .returning('*')
      .then((rows) => {
        userId = rows[0].id;
      });

    const message = `${EMAIL_HOST}/api/user/verify?id=${userId}&token=${token}`;
    // await sendEmail(user.email, 'Verify Email', verifyMessage);

    sendEmail({
      subject: '【noteflow】 Verify Email',
      text: message,
      to: user.email,
      from: EMAIL_USER,
      html: HTML_TEMPLATE(message),
    });

    ctx.session = {
      logined: true,
      email: user.email,
      name: user.name,
      picture: user.picture,
    };
    await ctx.session.save();

    await createUserBucket(user.email);
  } catch (err) {
    ctx.throw(500, JSON.stringify(err));
  }

  ctx.status = 200;
};

export default register;
