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
          <div style={{fontSize: "22px", fontWeight: 700}}>{word.foreignWord}</div>
          {word.translations.map( tr => {
            
            let didntset = (name) => <div>{`${name}: Didnt set`}</div>;

            var filtered_examples = tr.examples 
              ? tr.examples.map( (e, i) => <div key={i}>{`${++i}. ${e}`}</div> ) 
              : "Didn't set";

            var div_examples = <div>Examples: {filtered_examples}</div>;
            let pl = tr.partOfLang ? <div style={{paddingTop: "5px"}}><b>{`${tr.partOfLang}`}</b></div> : didntset("Lang part");
            let expl = tr.explanation 
              ? <div className='explanation'>Explanation: <div className='tr-exp'>{tr.explanation}</div></div> 
              : didntset("Explanation");
            
            return (
              <div style={{paddingLeft: "20px"}} key={tr.tr_id}>
                {pl}
                <div>{tr.tr_id}. {tr.translation}</div>
                {div_examples}
                {expl}
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
