import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_WORDS } from '../GraphQL/Queries';
import { Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ADD_WORD, ADD_TRANSLATION } from '../GraphQL/Mutations';

function AddTranslationForm() {

  const [words, setWords] = useState([]);
  const { data, loading, error } = useQuery(GET_WORDS);

  const [addWord] = useMutation(ADD_WORD);
  const [addTranslation] = useMutation(ADD_TRANSLATION);

  const [foreignWord, setForeignWord] = useState('');
  const [translations, setTranslations] = useState([{
    tr_id: 0,
    partOfLang: undefined,
    translation: undefined,
    examples: [],
    explanation: undefined,
    association: undefined,
    tags: []
  }]);

  const [langPart, setLangPart] = useState('');
  const [native, setNative] = useState('');
  const [examples, setExamples] = useState(['']);
  const [explanation, setExplanation] = useState('');
  const [association, setAssociation] = useState('');
  const [tags, setTags] = useState(['']);

  var [fwError, setFwError] = useState();
  var [nwError, setNwError] = useState();

  useEffect(() => {
    if(!loading){
      setWords(data.getAllWords);
      console.log(data)
    }
  }, [data, loading]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  var findTranslation = (someTr) => {
    return words.some( word => {
      return word.translations.some( tr => (tr.translation === someTr));
    });
  }
  
  var findForeignWord = (fw) => {
    return words.some( word => (word.foreignWord === fw ) );
  }

  var getTranslationDelailsByFW = (fw) => {
    var rs = []
    words.some( w => {
      if(w.foreignWord === fw) {
        rs = w.translations;
        return true;
      }
      return false;
    });
    return rs;
  } 

  const handleSubmit = (event) => {
    event.preventDefault();

    let nativeWordError = isTranslationExist({value: native, fieldName: "Translation"});

    if ( emptynessHandler([
      {value: foreignWord, fieldName: "Foreign word", setError: setFwError},
      {value: native, fieldName: "Translation", setError: setNwError}
    ]) ) {
      return;
    }

    if( nativeWordError ) {
      setNwError(nativeWordError);
      return;
    }

    setTranslations(translations.map( (tr, ind) => {
      tr.tr_id = ind + 1;
      tr.partOfLang = langPart;
      tr.translation = native;
      tr.examples = examples;
      tr.explanation = explanation;
      tr.association = association;
      tr.tags = tags;
      return tr;
    }));

    var translation = {
      tr_id: getTranslationDelailsByFW(foreignWord).length + 1,
      partOfLang: langPart,
      translation: native,
      examples: examples,
      explanation: explanation,
      association: association,
      tags: tags
    }

    if( findForeignWord(foreignWord) ) {
      

      addTranslation({
        variables: {
          foreignWord, translation
        }
      })
      .then ( () => {
        window.location.reload();
      });
    } else {

      addWord({
        variables: {
          foreignWord, translations
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
    setExamples([...examples, ""]);
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
    return findTranslation(error.value) && <div style={{color: "red"}}>Dublicate Error: Translation "{error.value}" already exists</div>;
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
            <Form.Control value={foreignWord} onChange={e => setForeignWord(e.target.value)} type="text" placeholder="Add foreign word" />
          </Form.Group>
          { fwError }
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Translation</Form.Label>
            <Form.Control value={native} onChange={e => setNative(e.target.value)} type="text" placeholder="Add translation" />
          </Form.Group>
          { nwError }
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Part of language</Form.Label>
            <Form.Control value={langPart} onChange={e => setLangPart(e.target.value)} type="text" placeholder="Add part of language" />
          </Form.Group>
        </Col>
      </Row>
      {
        examples.map( (v, i) => {
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
                  {examples.length - 1 === i && <Button style={{ marginRight: 20, marginTop: 30 }} onClick={handleAddExampleClick}>+</Button>}
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
                  {tags.length - 1 === i && <Button style={{ marginRight: 20, marginTop: 30 }} onClick={handleAddTagClick}>+</Button>}
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
