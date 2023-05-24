/* eslint-disable import/no-extraneous-dependencies */
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto-js';

const PrepareData = async () => [
  {
    id: 1,
    name: 'admin',
    email: 'admin@gmail.com',
    picture: '/var/admin.jpg',
    uuid: uuidv4(),
    password: await argon2.hash('112a', {
      type: argon2.argon2i,
      timeCost: 5,
      hashLength: 16,
    }),
    token: crypto.SHA256(Date.now()),
    verify: true,
  },
  {
    id: 2,
    name: 'test',
    email: 'test@gmail.com',
    uuid: uuidv4(),
    picture: '/var/test.jpg',
    password: await argon2.hash('test', {
      type: argon2.argon2i,
      timeCost: 5,
      hashLength: 16,
    }),
    token: crypto.SHA256(Date.now()),
  },
];

export async function getUsers() {
  const users = await PrepareData();

  return users.map((u) => ({
    id: u.id,
    uuid: u.uuid,
    email: u.email || `${u.name}@demo.com`,
    name: u.name,
    password: u.password,
    picture: u.picture,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

export async function seed(knex) {
  const users = await PrepareData();
  if (process.env.NODE_ENV === 'production') {
    await knex('users')
      .whereIn(
        'email',
        users.map((u) => u.email || `${u.name}@demo.com`),
      )
      .del();
  } else {
    await knex('users').del();
  }

  return knex('users').insert(await getUsers());
}
