import { gql } from '@apollo/client';

export const ADD_WORD = gql`

  mutation addWord($foreignWord: String!, $translations: [WordTranslationInputType]!) {
    addWord(foreignWord: $foreignWord, translations: $translations) {
      id
      foreignWord
      translations {
        tr_id
        partOfLang
        translation
      }
    }
  }
`
