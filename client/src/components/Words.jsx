import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_WORDS } from '../GraphQL/Queries';
import '../css/Words.css';

function GetWords() {

  const [words, setWords] = useState([]);
  const { data, loading, error } = useQuery(GET_WORDS);

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
  
  return (
    <div>
        {words.map( word => {
        return (
          <div key={word.id}>
          <h3>{word.foreignWord}</h3>
          {word.translations.map( tr => {
              let ex = '';
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
    </div>
  )
}

export default GetWords;
