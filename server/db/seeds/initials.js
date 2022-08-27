/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('native_words').del();
  await knex('foreign_words').del();
  await knex('foreign_words').insert([
    {id: 1, foreign_word: 'ample'},
    {id: 2, foreign_word: 'formidable'}
  ]);
  await knex('native_words').insert([
    {nw_id: 1, fw_id: 1, lang_part: 'noun', native_word: 'грізний', examples: ["some", "more", "examples"],
  explanation: "this is explanation", association: 'powerful man', tags: ['some', 'tags']},
    {nw_id: 2, fw_id: 2, lang_part: 'verb', native_word: 'сильний', examples: ["some", "more", "examples"],
    explanation: "this is explanation", association: 'strong man', tags: ['some', 'tags']},
    {nw_id: 3, fw_id: 2, lang_part: 'noun', native_word: 'могутній', examples: ["some", "more", "examples"],
    explanation: "this is explanation", association: 'powerful man', tags: ['some', 'tags']}
  ]);
};
