/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('native_words', table => {
      table.increments('id');
      table.string('lang_part', 20);
      table.string('native_word', 100);
      table.specificType('examples', 'text ARRAY');
      table.string('explanation');
      table.string('association');
      table.specificType('tags', 'text ARRAY');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('native_words');
};
