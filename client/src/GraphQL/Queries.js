import { gql } from '@apollo/client';

export const GET_WORDS = gql`
  query {
    getAllWords {
      id
      foreign_word
      native_words {
        nw_id
        fw_id
        lang_part
        native_word
        examples
        association
        explanation
        tags
      }
    }
  }
`
