import { useEffect, useState, ReactElement } from 'react';
import { debounce } from '../../util/baseUtils';

type TAutocompleteProps = {
  pull: (queryString: string) => any,
  placeholder?: string,
  icon: ReactElement,
}

export function Autocomplete(props: TAutocompleteProps) {
  const [queryString, setQueryString] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    debounce(generateResults, 1000)();
  }, [queryString]);

  const generateResults = async () => {
    if (queryString === '') {
      setResults([]);
    } else {
      const results = await props.pull(queryString);
      setResults(results);
    }
  };

  const renderIcon = () => {
    return (
      <div className={'autocomplete-icon'}>
        {props.icon ? props.icon : null}
      </div>
    );
  };

  const renderResults = () => {
    return (
      <div className={'autocomplete-results'}>
        {results.map((result) => {
         return (
           <div className={'result-container'}>
             {result.name}
           </div>
         )
        })}
      </div>
    );
  };

  return (
    <div className={'autocomplete'}>
      <div className={'autocomplete-query'}>
        {renderIcon()}
        <div className={'autocomplete-textbox'}>
          <input type={'text'}
                 value={queryString}
                 onChange={(e) => {
                   setQueryString(e.target.value);
                 }}
                 placeholder={props.placeholder}
          />
        </div>
        <div className={'autocomplete-btn'}>

        </div>
      </div>
      {renderResults()}
    </div>
  )
}