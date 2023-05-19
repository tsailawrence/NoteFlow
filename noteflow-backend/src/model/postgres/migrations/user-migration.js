export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('uuid');
    table.string('email');
    table.string('name');
    table.string('password');
    table.string('picture');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('jwt');
    table.string('token');
    table.boolean('verified').defaultTo(false);
  });
}

export function down(knex) {
  return knex.schema.dropTable('users');
}
