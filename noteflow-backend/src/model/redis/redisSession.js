import redisStore from 'koa-redis';
import session from 'koa-session';
import redisClient from './redisClient.js';

const redisSession = (app) => {
  // eslint-disable-next-line no-param-reassign
  app.keys = ['session secret...'];

  const SESSION_CONFIG = {
    // add redis as session.
    key: 'koa.sess',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: false,
    httpOnly: false,
    signed: true,
    rolling: false, // 每次請求都會重置 session
    renew: true, // 要到期的時候自動重置
    store: redisStore({
      client: redisClient,
    }),
  };

  return session(SESSION_CONFIG, app);
};

function parseCookies(cookieString) {
  const cookies = {};
  if (!cookieString) {
    return cookies;
  }
  const cookieArray = cookieString.split(';');
  for (let i = 0; i < cookieArray.length; i += 1) {
    const cookie = cookieArray[i];
    const separatorIndex = cookie.indexOf('=');
    const key = cookie.substring(0, separatorIndex).trim();
    const value = cookie.substring(separatorIndex + 1).trim();
    cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

async function getSession(cookieString) {
  const cookies = parseCookies(cookieString);
  const key = cookies['koa.sess'];
  const mapper = await redisClient.get(key);
  // eslint-disable-next-line no-underscore-dangle
  if (!mapper || mapper._expire > Date.now()) {
    return null;
  }
  return JSON.parse(mapper);
}

export default redisSession;
export { getSession };
