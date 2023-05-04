const db = require('../../db/connect');

class NativeWordsQueriesDAO {
    getAll() {
        return db.select('*').from('native_words');
    }

    getNativeWordsNumberByForeign() {
        return db.select('native_words').max('nw_id');
    }
}

module.exports = new NativeWordsQueriesDAO();
