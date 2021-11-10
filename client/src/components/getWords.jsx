import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { WORDS_REQUEST } from '../GraphQL/Queries';

function GetWords() {

    const {data} = useQuery(WORDS_REQUEST);
    console.log(data);
    
    
    return (
        <div>
            <h1>text</h1>
        </div>
    )
}

export default GetWords;
