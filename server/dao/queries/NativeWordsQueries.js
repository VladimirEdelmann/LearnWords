const db = require('../../db/connect');

class NativeWordsQueriesDAO {
    getAll() {
        return db.select('*').from('native_words');
    }
}

module.exports = new NativeWordsQueriesDAO();