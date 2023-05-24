export function up(knex) {
  return knex.schema.createTable('test', (table) => {
    table.increments();
    table.string('email').notNullable();
    table.string('name').notNullable();
    table.string('password').notNullable();
    table.string('token');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('test');
}
