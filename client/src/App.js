import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_WORDS } from './GraphQL/Queries';

import { Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ADD_WORD } from './GraphQL/Mutations';

const App = () => {
  const [words, setWords] = useState([]);
  const { data, loading, error } = useQuery(GET_WORDS);

  const [addWord] = useMutation(ADD_WORD);

  const [foreignWord, setForeignWord] = useState('');
  const [translations, setTranslations] = useState([{
    tr_id: undefined,
    partOflang: undefined,
    translation: undefined,
    examples: [],
    explanation: undefined,
    association: undefined,
    tags: []
  }]);
  const [trTranslation, setTrTranslation] = useState('');
  
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

  const handleSubmit = (event) => {
    // const word = {
    //   id: words.length + 1,
    //   foreignWord: event.target[0].value,
    //   translatedWord: "(не перекладено) " + event.target[0].value
    // };

    // words.push(word);
    // alert("last added word" + words[words.length]);
    setTranslations(translations.map( (tr, ind) => {
      tr.tr_id = ind + 1;
      tr.translation = trTranslation;
      return tr;
    }));
    console.log(trTranslation);
    console.log(translations);

    event.preventDefault();
    addWord({
      variables: {
        foreignWord, translations
      }
    }).then(({data}) => {
      console.log(data);
      setForeignWord('');
      setTranslations('');
      setTrTranslation('');
    });
  }

  return (
    <div className="main-layout">
      <Form onSubmit={handleSubmit} >
        <Row className="mb-3">
          <Col>
            <Form.Control value={foreignWord} onChange={e => setForeignWord(e.target.value)} type="text" placeholder="Add foreign word" />
          </Col>
          <Col>
            <Form.Control value={trTranslation} onChange={e => setTrTranslation(e.target.value)} type="text" placeholder="Add translation" />
          </Col>
          <Col>
            <Button type="Submit">Add</Button>
          </Col>
        </Row>
      </Form>
      <header>
        {words.map( word => {
          return (
            <div key={word.id}>
              <h3>{word.foreignWord}</h3>
              {word.translations.map( tr => {
                let ex = ''
                if (tr.examples) {
                  ex = tr.examples.map( (x, ind) => (<div key={ind} className='tr-exa'>{`${ind + 1}. ` + x}</div>));
                }
                return (
                  
                  <div key={tr.tr_id}>
                    <div>{tr.tr_id}. {tr.translation}</div>
                    <div className='examples'>Examples: {ex}</div>
                    <div className='explanation'>Explanation: <div className='tr-exp'>{tr.explanation}</div></div>
                    <div className='association'>Association: <div className='tr-ass'>{tr.association}</div></div>
                  </div>
                );
              })}
            </div>
          )
        })}
      </header>
    </div>
  );
}

export default App;
