import { gql } from '@apollo/client';

export const ADD_WORD = gql`
  mutation addWord($foreignWord: String!, $translatedWord: String!) {
    addWord(foreignWord: $foreignWord, translatedWord: $translatedWord) {
        id
        foreignWord
        translatedWord
    }
  }
`
