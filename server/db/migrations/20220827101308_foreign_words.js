/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable('foreign_words', table => {
      table.increments('id').unsigned().primary();
      table.string('foreign_word', 100).notNullable();
  
      // table.foreign('id').references('fw_id').inTable('native_words');
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable('foreign_words');
  };
