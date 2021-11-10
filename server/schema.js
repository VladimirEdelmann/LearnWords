const { 
    GraphQLSchema, 
    GraphQLInt, 
    GraphQLString, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLObjectType, 
    GraphQLInputObjectType 
} = require('graphql');
const fs = require('fs');
const fileName = './db/words.json';
var words = require('/LearnWords/server/db/words.json');

const WordType = new GraphQLObjectType({
    name: "WordType",
    description: "Represents foreign word and translation with explanation and etc.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        foreignWord: { type: GraphQLNonNull(GraphQLString) },
        translations: { type: GraphQLNonNull(GraphQLList(WordTranslationType)) }
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
        getWord: {
            type: WordType,
            description: "Returns a word by id",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => words.find( word => word.id === args.id)  
        },
        getAllWords: {
            type: GraphQLList(WordType),
            description: "Returns all words",
            resolve: () => words     
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
                let word = {
                    id: words[words.length - 1].id + 1,
                    foreignWord: args.foreignWord,
                    translations: args.translations.map( (tr, ind) => {
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
                
                let thisWord = {
                    id: args.id,
                    foreignWord: args.foreignWord,
                    translations: args.translations
                }

                words = words.map( word => {
                    if (args.id === word.id) {
                        word = thisWord;
                    }
                    return word;
                });
                console.log("this2")
                console.log(JSON.stringify(thisWord, null, 2));
                // fs.writeFile(fileName, JSON.stringify(words, null, 2), (err) => {
                //     if (err) return console.log(err);
                // });
                return thisWord;
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