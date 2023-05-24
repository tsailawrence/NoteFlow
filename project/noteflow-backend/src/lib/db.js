/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-mutable-exports */
import knex from 'knex';
import knexfile from '../model/postgres/knexfile.js';

let db;

if (
  process.env.NODE_ENV === 'local' ||
  process.env.NODE_ENV === 'development'
) {
  db = knex(knexfile.development);
} else {
  db = knex(knexfile.production);
}

export default db;
