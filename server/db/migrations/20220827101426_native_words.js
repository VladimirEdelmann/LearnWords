/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
 return knex.schema.createTable('native_words', table => {
   table.increments('nw_id').unsigned().primary();
   table.integer('fw_id')/*.notNullable()*/
   table.string('lang_part', 20);
   table.string('native_word', 100).notNullable();
   table.specificType('examples', 'text ARRAY');
   table.string('explanation');
   table.string('association');
   table.specificType('tags', 'text ARRAY');
   table.foreign('fw_id').references('foreign_words.id')
 })
};
 
/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {
  return knex.schema.dropTable('native_words');
};
