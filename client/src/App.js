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

  //const [addWord] = useMutation(ADD_WORD);

  const [foreignWord, setForeignWord] = useState('');
  const [translatedWord, setTranslatedWord] = useState('');
  
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
    event.preventDefault();
    // addWord({
    //   variables: {
    //     foreignWord, translatedWord
    //   }
    // }).then(({data}) => {
    //   console.log(data);
    //   setForeignWord('');
    //   setTranslatedWord('');
    // });
  }

  return (
    <div className="main-layout">
      <Form onSubmit={handleSubmit} >
        <Row className="mb-3">
          <Col>
            <Form.Control value={foreignWord} onChange={e => setForeignWord(e.target.value)} type="text" placeholder="Add foreign word" />
          </Col>
          <Col>
            <Form.Control value={translatedWord} onChange={e => setTranslatedWord(e.target.value)} type="text" placeholder="Add translation" />
          </Col>
          <Col>
            <Button type="Submit">Add</Button>
          </Col>
        </Row>
      </Form>
      <header>
        <p>Hallo Freunde!</p>
        {words.map( word => {
          let tr = word.translations.map( tr => (tr.translation) );
          return <div>{word.id}. {word.foreignWord} - {tr.join(', ')}</div>;
        })}
      </header>
    </div>
  );
}

export default App;
