const db = require('../../db/connect');

class WordsDAO {

    async createWord(foreign_word, native_word) {

        // adding new record to foreign words table returning id
        const [id] = await db.insert({
            foreign_word: foreign_word
        }).into('foreign_words').returning('id');
        
        //adding new record to native words table
        for (let i = 0; i < native_word.length; i++) {
            await db.insert({
                fw_id: id.id,
                lang_part: native_word[i].lang_part,
                native_word: native_word[i].native_word,
                examples: native_word[i].examples,
                explanation: native_word[i].examples,
                association: native_word[i].association,
                tags: native_word[i].tags
                
            }).into('native_words');
        }
    }

    async addNewNative(native_word) {
        await db.insert({
            fw_id: native_word.fw_id,
            lang_part: native_word.lang_part,
            native_word: native_word.native_word,
            examples: native_word.examples,
            explanation: native_word.examples,
            association: native_word.association,
            tags: native_word.tags
        }).into('native_words');
    }
}

module.exports = new WordsDAO();
