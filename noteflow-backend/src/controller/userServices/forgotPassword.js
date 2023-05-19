import crypto from 'crypto-js';
import argon2 from 'argon2';
import db from '../../lib/db.js';
import sendEmail from '../../lib/email.js';
import HTML_TEMPLATE from '../../lib/mail-template.js';
import redisClient from '../../model/redis/redisClient.js';

const { EMAIL_USER, EMAIL_HOST } = process.env;

const forgotPassword = async (ctx) => {
  const { email } = ctx.request.body;

  if (!email) {
    ctx.throw(400, 'You did not provide sufficient data.');
  }

  const result = await db('users').first().where({ email });
  if (!result) {
    ctx.throw(401, 'This email does not exist.');
  }

  const randomString = Math.random().toString(15);
  const token = crypto.SHA256(randomString).toString(crypto.enc.Hex);

  const message = `${EMAIL_HOST}/api/user/reset-password-auth?token=${token}?email=${email}`;
  try {
    sendEmail({
      subject: '[Noteflow] Edit Your Password Now!',
      text: message,
      to: email,
      from: EMAIL_USER,
      html: HTML_TEMPLATE(message),
    });

    await redisClient.set(`reset-password-${token}`, 1, 'EX', 86400);

    ctx.status = 200;
    // ctx.body = return html 回去
  } catch (e) {
    ctx.throw(500, 'Internal server error');
  }
};

const forgotPasswordAuth = async (ctx) => {
  const { token, email } = ctx.query;
  const value = await redisClient.get(`reset-password-${token}`);

  ctx.assert(value, 408, 'Request timeout.');

  ctx.session = {
    resetPassword: true,
    email,
  };

  await ctx.session.save();

  ctx.status = 200;
};

const forgotPasswordRenew = async (ctx) => {
  if (ctx.session.logined === true) {
    const { email } = ctx.session;
    const { oldPassword, newPassword } = ctx.request.body;

    const result = await db('users').first().where({ email });

    const validate = await argon2.verify(result.password, oldPassword);

    ctx.assert(validate, 401, 'Old password is invalid.');

    const password = await argon2.hash(newPassword);
    await db('users').update({ password }).where({ email });
  } else {
    const { email, resetPassword } = ctx.session;

    ctx.assert(resetPassword, 408, 'Request timeout.');

    // TODO
  }

  ctx.status = 200;
};

export { forgotPassword, forgotPasswordAuth, forgotPasswordRenew };
