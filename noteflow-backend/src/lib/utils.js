/* eslint-disable import/no-extraneous-dependencies */
import config from 'config';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

export function generateJWTforUser(user = {}) {
  return {
    ...user,
    token: jwt.sign(
      {
        sub: _.pick(user, ['id', 'email', 'username']),
      },
      config.get('secret'),
      {
        expiresIn: '7d',
      },
    ),
  };
}

export function getSelect(table, prefix, fields) {
  return fields.map((f) => `${table}.${f} as ${prefix}_${f}`);
}
