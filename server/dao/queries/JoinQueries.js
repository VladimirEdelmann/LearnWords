const db = require('../../db/connect');

class JoinQueriesDAO {
    async getForeignIncludeNative() {
        let arr = []
        const native_words = await db.select('*').from('native_words');
        const foreign_words = await db.select('*').from('foreign_words')
            .then((items)=>{
                items.map((item => {
                    arr.push({
                        id: item.id,
                        foreign_word: item.foreign_word,
                        native_words: native_words.filter((v) => {
                            let native
                            if(item.id === v.fw_id) {
                                native = {
                                    nw_id:       v.nw_id,
                                    fw_id:       v.fw_id,
                                    lang_part:   v.lang_part,
                                    native_word: v.native_word,
                                    examples:    v.examples,
                                    exlanation:  v.explanation,
                                    association: v.association, 
                                    tags:        v.tags
                                }
                            }
                            
                            return native;
                        })
                            
                    });
                }));
                
                return arr;
            });
        return foreign_words;
    }
}

module.exports = new JoinQueriesDAO();
