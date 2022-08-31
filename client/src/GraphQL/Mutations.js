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

const ADD_NEW_TRANSLATION = gql`

  mutation addNewTranslation($foreign_word: String!, $native_words: NativeWordInputType!) {
    addNewTranslation(foreign_word: $foreign_word, native_words: $native_words) {
      foreign_word
      native_words {
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

export {ADD_WORD, ADD_NEW_TRANSLATION};