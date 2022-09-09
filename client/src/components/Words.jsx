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

  let validate = (word) => {
    if(word === "" || word === undefined || null || word.replace(/\s/g, '') === "") {
      return false;
    }
  }
   
  return (
    <div>
        {words.map( word => {
        return (
          <div key={word.id}>
          <div style={{fontSize: "22px", fontWeight: 700}}>{word.foreign_word}</div>
          {word.native_words.map( (nw, i) => {
            let didntset = (name) => <div>{`${name}: Didnt set`}</div>;

            var filtered_examples = nw.examples 
              ? nw.examples.map( (e, i) => <div className='nw-exa' key={i}>{`${++i}. ${e}`}</div> ) 
              : "Didn't set";

            var div_examples = <div>Examples: {filtered_examples}</div>;
            let pl = nw.lang_part ? <div style={{paddingTop: "5px"}}><b>{`${nw.lang_part}`}</b></div> : didntset("Lang part");
            let expl = nw.explanation 
              ? <div>Explanation: <div className='nw-exp'>{nw.explanation}</div></div> 
              : didntset("Explanation");
            
            let formated_association = nw.association ? 
              <div>Association: <div className='nw-ass'>{nw.association}</div></div> : didntset("Association");
            
            let filtered_tags = nw.tags
              ? nw.tags.map( (e, i) => {
                if(validate(e)) {
                  return <div className='nw-exa' key={i}>{`${++i}. ${e}`}</div>
                } else {
                  return <div className='nw-exa' key={i}>{`${++i}. Didn't set`}</div>
                }
              }) 
              : "Didn't set";
            
            return (
              <div style={{paddingLeft: "20px"}} key={nw.nw_id}>
                {pl}
                <div>{++i}. {nw.native_word}</div>
                {div_examples}
                {expl}
                {formated_association}
                <div className="tags">Tags: {filtered_tags}</div>
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
