// eslint-disable-next-line import/no-extraneous-dependencies
import fs from 'fs';
import path from 'path';
import db from '../../lib/db.js';
import CODE from '../../lib/httpStatus.js';

const BASE_PATH = path.join(process.cwd(), 'images');

const setUserPhoto = async (ctx) => {
  const { image } = ctx.request.files;
  const { email } = ctx.session;

  const by = image[0].mimetype.split('/')[1];
  const filename = `${email}-${Date.now()}.${by}`;

  fs.writeFileSync(path.join(BASE_PATH, filename), image[0].buffer, {});

  await db('users')
    .update({ picture: `https://noteflow.live/api/fs/image?id=${filename}` })
    .where({ email });

  ctx.status = CODE.success;
  ctx.body = `https://noteflow.live/api/fs/image?id=${filename}`;
};

export default setUserPhoto;
