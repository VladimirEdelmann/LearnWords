const { 
    GraphQLSchema, 
    GraphQLInt, 
    GraphQLString, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLObjectType, 
    GraphQLInputObjectType,
    GraphQLError
} = require('graphql');
const fs = require('fs');
const fileName = './db/words.json';
var words = require('./db/words.json');

const knex = require('knex');
const knexfile = require('./knexfile');

const getAllForeignWords = () => ( words.map( (word) => (word.foreignWord)) );

const getTranslationsByForeignWord = (foreignWord) => {
    var rs = []
    words.some( word => {
        if( word.foreignWord === foreignWord ) {
            rs = word.translations;
            return true;
        }
        return false;
    });
    return rs;
}

const WordType = new GraphQLObjectType({
    name: "WordType",
    description: "Represents foreign word and translation with explanation and etc.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        foreignWord: { type: GraphQLNonNull(GraphQLString) },
        translations: { type: GraphQLNonNull(GraphQLList(WordTranslationType)) }
    })
});

const NativeWordType = new GraphQLObjectType({
    name: "NativeWordType",
    description: "",
    fields: () => ({
        native_word_id: { type: GraphQLNonNull(GraphQLInt) },
        lang_part: { type: GraphQLString },
        native_word: { type: GraphQLNonNull(GraphQLString) },
        examples: { type: GraphQLList(GraphQLString) },
        explanation: { type: GraphQLString },
        association: { type: GraphQLString },
        tags: { type: GraphQLList(GraphQLString) }
    })
});

const WordReturnType = new GraphQLObjectType({
    name: "WordReturnType",
    description: "Doesn't return WordTranslationType as list",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        foreignWord: { type: GraphQLNonNull(GraphQLString) },
        translations: { type: GraphQLNonNull(WordTranslationType) }
    })
});

const WordTranslationType = new GraphQLObjectType({
    name: "WordTranslationType",
    description: "Represents a different translation to mother language for foreign word",
    fields: () => ({
        tr_id: { type: GraphQLNonNull(GraphQLInt) },
        partOfLang: { type: GraphQLString },
        translation: { type: GraphQLNonNull(GraphQLString) },
        examples: { type: GraphQLList(GraphQLString) },
        explanation: { type: GraphQLString },
        association: { type: GraphQLString },
        tags: { type: GraphQLList(GraphQLString) }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: "RootQueryType",
    description: "Top level query type",
    fields: () => ({
        getWordByID: {
            type: WordType,
            description: "Returns a word by id",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => words.find( word => word.id === args.id)  
        },
        getWordByName: {
            type: WordType,
            description: "Returns a word by foreign name",
            args: {
                foreignWord: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => words.find( word => word.foreignWord === args.foreignWord)
        },
        getAllWords: {
            type: GraphQLList(WordType),
            description: "Returns all words",
            resolve: () => words     
        },
        getNativeWords: {
            type: NativeWordType,
            description: "Returns a list of native words",
            resolve: () => {
                // let rs = knex('native_words').select('*');
                // console.log(rs);
                let rs = knex.raw('select * from native_words;').catch(err => {
                    console.log(err);
                })
                console.log(JSON.stringify(rs, null, 0))
                //return rs;
            }
        }
    })
});

const WordTranslationInputType = new GraphQLInputObjectType({
    name: "WordTranslationInputType",
    description: "Input type version for WordTranslationType",
    fields: () => ({
        tr_id: { type: GraphQLInt },
        partOfLang: { type: GraphQLString },
        translation: { type: GraphQLNonNull(GraphQLString) },
        examples: { type: GraphQLList(GraphQLString) },
        explanation: { type: GraphQLString },
        association: { type: GraphQLString },
        tags: { type: GraphQLList(GraphQLString) }
    })
});

const verifyTranslation = (ts, existTs) => { // try to break to few functions
    let rst = null;
    console.log('here')
    ts.map( tr => {
        rst = existTs.map( ets => {
            console.log("this1")
            console.log(JSON.stringify(ets, null, 2));
            if (tr.tr_id === ets.tr_id) {
                if (tr.translation !== undefined) {
                    ets.translation = tr.translation;
                }
                if ( tr.partOfLang === undefined ) {
                    if (ets.partOfLang === undefined) {
                        ets.partOfLang = "";
                    }
                } else {
                    ets.partOfLang = tr.partOfLang;
                }
                if ( tr.examples === undefined ) {
                    if (ets.examples === undefined) {
                        ets.examples = "";
                    }
                } else {
                    ets.examples = tr.examples;
                }
                if ( tr.explanation === undefined ) {
                    if (ets.explanation === undefined) {
                        ets.explanation = "";
                    }
                } else {
                    ets.explanation = tr.explanation;
                }
                if ( tr.association === undefined ) {
                    if (ets.association === undefined) {
                        ets.association = "";
                    }
                } else {
                    ets.association = tr.association;
                }
                if ( tr.tags === undefined ) {
                    if (ets.tags === undefined) {
                        ets.tags = "";
                    }
                } else {
                    ets.tags = tr.tags;
                }
            }
            
            return ets;
        });
    });
    return rst;
}

// gets an array of object that have the value from the field and name of that field
// throws an error if field is empty
const isFieldsEmpty = (fields) => {
    var i = 0;
    while (i < fields.length) {
        if (fields[i].value === "") {
            throw new GraphQLError('EMPTY_FIELD_ERROR: The field ' + fields[i].name + ' must not be empty.' );
        }
        i++;
    }
}

// gets the elements of the object, returns complete object
var setAllWords = (id, foreignWord, translations) => {
    return {
        id: id,
        foreignWord: foreignWord,
        translations: translations
    }
}

// set new translation in an array of transtations that belongs to some foreign word
// get foreign word and usual fields of translation 
// returns an array of translations
var setNewTranslation = (foreignWord, partOfLang, translation, examples, explanation, association, tags) => {
    var thisword

    isFieldsEmpty([ 
        { value: foreignWord, name: "Foreign word" } 
    ]);

    if( findFireignWord(foreignWord) ) {
        if( findTranslation(translation) ) {
            throw new GraphQLError("Such translation already exists");
        }
        words.some( word => {
            isFieldsEmpty([ 
                { value: translation, name: "Translation" } 
            ]);
            
            if (word.foreignWord === foreignWord) {
                word.translations.push({
                    tr_id: getTranslationsByForeignWord(foreignWord).length + 1,
                    partOfLang: partOfLang,
                    translation: translation,
                    examples: examples,
                    explanation: explanation,
                    association: association,
                    tags: tags
                });
                thisword = word;
                return true;
            }
        });
        return setAllWords(thisword.id, thisword.foreignWord, thisword.translations);
    } else { 
        throw new GraphQLError("You trying to add new foreign word, not new translation. " + 
            "\nYou need to add this word as a new different word"); 
    }
}

// searches for at least one translation and returns if found
var findTranslation = (someTr) => {
    return words.some( word => {
        return word.translations.some( tr => (tr.translation === someTr));
    });
}

var findFireignWord = (fw) => {
    return words.some( word => (word.foreignWord === fw ) );
}

const RootMutationType = new GraphQLObjectType({
    name: "RootMutationType",
    description: "Top level mutation type",
    fields: () => ({
        addWord: {
            type: WordType,
            description: "Adds new word record to db",
            args: {
                foreignWord: { type: GraphQLNonNull(GraphQLString) },
                translations: { type: GraphQLNonNull(GraphQLList(WordTranslationInputType)) }
            },
            resolve: (parent, args) => {
                //console.log(JSON.stringify(args.translations, null, 2));
                isFieldsEmpty([ 
                    { value: args.foreignWord, name: "Foreign word" } 
                ]);
                
                let word = {
                    id: words[words.length - 1].id + 1,
                    foreignWord: args.foreignWord,
                    translations: args.translations.map( (tr, ind) => {
                        isFieldsEmpty([
                            { value: tr.translation, name: "Translation" }
                        ]);
                        console.log("args.foreignWord")
                        console.log(args.foreignWord)
                        if (getTranslationsByForeignWord(args.foreignWord).find( el => el === tr.translation)) {
                            throw new GraphQLError("This word is already added in dictionary");
                        }
                        tr.tr_id = ind + 1;
                        return tr;
                    })
                }
                words.push(word);
                console.log(JSON.stringify(word, null, 2));
                // fs.writeFile(fileName, JSON.stringify(words, null, 2), (err) => {
                //     if (err) return console.log(err);
                // });
                return word;
            }
        },
        addNewTranslation: {
            type: WordType,
            description: "Adds new translation to current foreign word",
            args: {
                foreignWord: { type: GraphQLNonNull(GraphQLString) },
                translation: { type: GraphQLNonNull(WordTranslationInputType) }
            },
            resolve: (parent, args) => {
                console.log("The addNewTranslation goes")
                var rs = setNewTranslation(
                    args.foreignWord,
                    args.translation.partOfLang, 
                    args.translation.translation, 
                    args.translation.examples, 
                    args.translation.explanation, 
                    args.translation.association, 
                    args.translation.tags
                );
                console.log("Word Object")
                console.log(rs)
                return rs;
            }
        },
        editWord: {
            type: WordType,
            description: "Edits a word by id",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
                foreignWord: { type: GraphQLNonNull(GraphQLString) },
                translations: { type: GraphQLNonNull(GraphQLList(WordTranslationInputType)) }
            }, 
            resolve: (parent, args) => {
                
                words.map( word => {
                    if (args.id === word.id) {
                        args.translations = verifyTranslation(args.translations, word.translations);
                    }
                });
                
                var rs = setAllWords(args.id, args.foreignWord, args.translations);

                words = words.map( word => {
                    if (args.id === word.id) {
                        word = rs;
                    }
                    return word;
                });
                console.log("this2")
                console.log(JSON.stringify(rs, null, 2));
                // fs.writeFile(fileName, JSON.stringify(words, null, 2), (err) => {
                //     if (err) return console.log(err);
                // });
                return rs;
            }
        },
        deleteWord: {
            type: GraphQLList(WordType),
            description: "Deletes a word by id",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                words = words.filter( word => word.id !== args.id);
                console.log(JSON.stringify(words, null, 2));
                return words;
            }
        }
    })
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

module.exports = schema;