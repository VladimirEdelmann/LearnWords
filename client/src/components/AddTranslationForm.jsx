import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_WORDS } from '../GraphQL/Queries';
import { Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ADD_WORD, ADD_NEW_TRANSLATION } from '../GraphQL/Mutations';

import { validate } from '../utils';

function AddTranslationForm() {

  const [words, setWords] = useState([]);
  const { data, loading, error } = useQuery(GET_WORDS);

  const [addWord] = useMutation(ADD_WORD);
  const [addNewTranslation] = useMutation(ADD_NEW_TRANSLATION);

  const [foreign_word, setForeignWord] = useState('');
  const [native_words, setNativeWords] = useState([{
    nw_id: 0,
    lang_part: undefined,
    native_word: undefined,
    examples: [],
    explanation: undefined,
    association: undefined,
    tags: []
  }]);

  const [lang_part, setLangPart] = useState('');
  const [native_word, setNativeWord] = useState('');
  const [examples, setExamples] = useState(['']);
  const [explanation, setExplanation] = useState('');
  const [association, setAssociation] = useState('');
  const [tags, setTags] = useState(['']);

  var [fwError, setFwError] = useState();
  var [nwError, setNwError] = useState();

  useEffect(() => {
    if(!loading){
      console.log('AddTranslationForm component', data)
      setWords(data.getAllWords);
    }
  }, [data, loading]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  var findTranslation = (foreign, native) => {
    return words.some( word => {
      if(word.foreign_word === foreign) {
        return word.native_words.some( tr => (tr.native_word === native));
      }
      return false;
    });
  }
  
  var findForeignWord = (fw) => {
    return words.some( word => (word.foreign_word === fw ) );
  }

  var getTranslationDelailsByFW = (fw) => {
    var rs = []
    words.some( w => {
      if(w.foreign_word === fw) {
        rs = w.native_words;
        return true;
      }
      return false;
    });
    return rs;
  } 

  const handleSubmit = (event) => {
    event.preventDefault();

    let nativeWordError = isTranslationExist({fwList: foreign_word, value: native_word, fieldName: "Translation"});

    if ( emptynessHandler([
      {value: foreign_word, fieldName: "Foreign word", setError: setFwError},
      {value: native_word, fieldName: "Translation", setError: setNwError}
    ]) ) {
      return;
    }

    if( nativeWordError ) {
      setNwError(nativeWordError);
      return;
    }

    setNativeWords(native_words.map( (tr, ind) => {
      tr.nw_id = ind + 1;
      tr.lang_part = lang_part;
      tr.native_word = native_word;
      tr.examples = examples;
      tr.explanation = explanation;
      tr.association = association;
      tr.tags = tags;
      return tr;
    }));

    if( findForeignWord(foreign_word) ) {

      let native_words = {
        nw_id: getTranslationDelailsByFW(foreign_word).length + 1,
        lang_part: lang_part,
        native_word: native_word,
        examples: examples,
        explanation: explanation,
        association: association,
        tags: tags
      }

      console.log("native_words: ", native_words)
      
      addNewTranslation({
        variables: {
          foreign_word, native_words
        }
      })
      .then ( () => {
        window.location.reload(true);
      });
    } else {

      addWord({
        variables: {
          foreign_word, native_words
        }
      })
      .then( () => {
        window.location.reload();
      });
    }
    
  }

  // Examples
  const handleInputExampleChange = (e, index) => {
    const { value } = e.target;
    const list = [...examples];
    list[index] = value;
    setExamples(list);
  }

  const handleRemoveExampleClick = (index) => {
    const list = [...examples];
    list.splice(index, 1);
    setExamples(list);
  }

  const handleAddExampleClick = () => {
    setExamples([...examples, null]);
  }

  //Tags
  const handleInputTagChange = (e, index) => {
    const { value } = e.target;
    const list = [...tags];
    list[index] = value;
    setTags(list);
  }

  const handleRemoveTagClick = (index) => {
    const list = [...tags];
    list.splice(index, 1);
    setTags(list);
  }

  const handleAddTagClick = () => {
    setTags([...tags, ""]);
  }

  // Errors
  const isFieldEmply = (error) => {
    return error.value === "" && <div style={{color: "red"}}>Empty Field Error: Field {error.fieldName} must not be empty.</div>;
  }

  const isTranslationExist = (error) => {
    return findTranslation(error.fwList, error.value) && <div style={{color: "red"}}>Dublicate Error: Translation "{error.value}" already exists</div>;
  }

  const emptynessHandler = (error) => {
    var i = 0, rs = false;
    while(i < error.length) {
      let errorTemp = isFieldEmply({ value: error[i].value, fieldName: error[i].fieldName })
      if ( errorTemp ) {
        error[i].setError(errorTemp);
        rs = true;
      } else { error[i].setError(false) }
      i++;
    }
    return rs;
  }
  
  return (
    <Form onSubmit={handleSubmit} >
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Foreign word</Form.Label>
            <Form.Control value={foreign_word} onChange={e => setForeignWord(e.target.value)} type="text" placeholder="Add foreign word" />
          </Form.Group>
          { fwError }
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Translation</Form.Label>
            <Form.Control value={native_word} onChange={e => setNativeWord(e.target.value)} type="text" placeholder="Add translation" />
          </Form.Group>
          { nwError }
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Part of language</Form.Label>
            <Form.Control value={lang_part} onChange={e => setLangPart(e.target.value)} type="text" placeholder="Add part of language" />
          </Form.Group>
        </Col>
      </Row>
      {
        examples.map( (v, i) => {
          console.log('V', v)
          return (
            <div key={i}>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Example</Form.Label>
                    <Form.Control value={v} onChange={e => handleInputExampleChange(e, i)} type="text" placeholder="Add example" />
                  </Form.Group>
                </Col>
                <Col>
                  {examples.length !== 1 && <Button style={{ marginRight: 20, marginTop: 30 }} onClick={() => handleRemoveExampleClick(i)}>-</Button>}
                  {examples.length - 1 === i && validate(v) && <Button style={{ marginRight: 20, marginTop: 30 }} onClick={handleAddExampleClick}>+</Button>}
                </Col>
              </Row>
              {/* <div style={{ marginTop: 20 }}>{JSON.stringify(exampleFields[i])}</div> */}
            </div>
          );
        })
      }
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Explanation</Form.Label>
            <Form.Control value={explanation} onChange={e => setExplanation(e.target.value)} type="text" placeholder="Add explanation" />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Association</Form.Label>
            <Form.Control value={association} onChange={e => setAssociation(e.target.value)} type="text" placeholder="Add association" />
          </Form.Group>
        </Col>
      </Row>
      {
        tags.map( (v, i) => {
          return (
            <div key={i}>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Tags</Form.Label>
                    <Form.Control value={v} onChange={e => handleInputTagChange(e, i)} type="text" placeholder="Add tag" />
                  </Form.Group>
                </Col>
                <Col>
                  {tags.length !== 1 && <Button style={{ marginRight: 20, marginTop: 30 }} onClick={() => handleRemoveTagClick(i)}>-</Button>}
                  {tags.length - 1 === i && v !== '' && <Button style={{ marginRight: 20, marginTop: 30 }} onClick={handleAddTagClick}>+</Button>}
                </Col>
              </Row>
            </div>
          );
        })
      }
      <Row>
        <Col>
          <Button type="Submit">Add word</Button>
        </Col>
      </Row>
    </Form>
  );

}

export default AddTranslationForm;
