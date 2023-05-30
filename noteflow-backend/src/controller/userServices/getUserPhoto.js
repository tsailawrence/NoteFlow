import fs from 'fs';
import path from 'path';

import db from '../../lib/db.js';
import CODE from '../../lib/httpStatus.js';

const getUserPhoto = async (ctx) => {
  let { email } = ctx.query;
  if (!email) {
    email = ctx.session.email;
  }
  let result;
  try {
    result = await db('users').first().where({ email });
    if (result.picture) {
      if (
        !result.picture.startsWith('http') &&
        !fs.existsSync(path.join(process.cwd(), 'images', result.picture))
      ) {
        result.picture = null;
        db('users').insert({ picture: null }).where({ email });
      }
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}

  ctx.status = CODE.success;
  ctx.body = JSON.stringify(result ? result.picture : null);
  ctx.set('Content-Type', 'application/json');
};

export default getUserPhoto;
