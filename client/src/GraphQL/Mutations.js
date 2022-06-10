import { gql } from '@apollo/client';

const ADD_WORD = gql`

  mutation addWord($foreignWord: String!, $translations: [WordTranslationInputType]!) {
    addWord(foreignWord: $foreignWord, translations: $translations) {
      id
      foreignWord
      translations {
        tr_id
        partOfLang
        translation
        examples
        explanation
        association
        tags
      }
    }
  }
`;

const ADD_TRANSLATION = gql`

  mutation addNewTranslation($foreignWord: String!, $translation: WordTranslationInputType!) {
    addNewTranslation(foreignWord: $foreignWord, translation: $translation) {
      id
      foreignWord
      translations {
        tr_id
        partOfLang
        translation
        examples
        explanation
        association
        tags
      }
    }
  }
`;

export {ADD_WORD, ADD_TRANSLATION};