import { gql } from '@apollo/client';

export const GET_WORDS = gql`
  query {
    getAllWords {
      id
      foreignWord
      translations {
        tr_id
        partOfLang
        translation
        examples
        association
        explanation
        tags
      }
    }
  }
`
