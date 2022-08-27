import { gql } from '@apollo/client';

const ADD_WORD = gql`

  mutation addWord($foreign_word: String!, $native_words: [NativeWordInputType]!) {
    addWord(foreign_word: $foreign_word, native_words: $native_words) {
      id
      foreign_word
      native_words {
        nw_id
        lang_part
        native_word
        examples
        explanation
        association
        tags
      }
    }
  }
`;

const ADD_TRANSLATION = gql`

  mutation addNewTranslation($foreign_word: String!, $native_word: NativeWordInputType!) {
    addNewTranslation(foreign_word: $foreign_word, native_word: $native_word) {
      id
      foreign_word
      native_word {
        nw_id
        lang_part
        native_word
        examples
        explanation
        association
        tags
      }
    }
  }
`;

export {ADD_WORD, ADD_TRANSLATION};