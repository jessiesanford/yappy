import { useEffect, useState, ReactElement, useRef } from 'react';
import { debounce, isDescendant } from '../../util/baseUtils';
import { LoadingSpinner, LoadingSpinner2 } from './loading';
import { FiSearch } from 'react-icons/fi';
import { useOutsideClick } from '../../helpers/reactUtils';

type TAutocompleteProps = {
  pull: (queryString: string) => any,
  placeholder?: string,
  icon?: ReactElement,
}

export function Autocomplete(props: TAutocompleteProps) {
  const [active, setActive] = useState(false);
  const [queryString, setQueryString] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(false);
  }, []);

  useEffect(() => {
    if (queryString === '') {
      setResults([]);
      setFetching(false);
    } else if (active) {
      setFetching(true);
      debounce(generateResults, 500)();
    }
  }, [queryString, active]);

  const containerRef = useRef(null);
  const queryContainerRef = useOutsideClick((e) => {
    const clickTarget = e.target;
    if (!isDescendant(clickTarget, containerRef.current)) {
      setActive(false);
    }
  });
  const inputRef = useRef(null);

  const generateResults = async () => {
    if (queryString === '') {
      setResults([]);
    } else {
      const results = await props.pull(queryString);
      setResults(results);
      setFetching(false);
    }
  };

  const renderIcon = () => {
    return (
      <div className={'autocomplete-icon'}>
        {props.icon ? props.icon : <FiSearch/>}
      </div>
    );
  };

  const renderResults = () => {
    if (active) {
      return (
        <div className={'autocomplete-results'}>
          {results.map((result) => {
            return (
              <div key={result.id} className={'result-container'}>
                {result.name}
              </div>
            )
          })}
        </div>
      );
    }
  };

  return (
    <div className={'autocomplete'}
         ref={containerRef}
         onClick={() => {
           if (inputRef.current) {
             inputRef.current.focus();
           }
         }}
    >
      <div className={`autocomplete-query ${active ? 'active' : null}`}>
        {renderIcon()}
        <div className={'autocomplete-textbox'} ref={queryContainerRef}>
          <input type={'text'}
                 value={queryString}
                 onFocus={() => {
                   setActive(true)}
                 }
                 onChange={(e) => {
                   setQueryString(e.target.value);
                 }}
                 placeholder={props.placeholder}
                 ref={inputRef}
          />
        </div>
        <div className={'autocomplete-status'}>
          {fetching ? <LoadingSpinner2 size={'12px'} color={'#a0a0a0'} /> : null}
        </div>
      </div>
      {renderResults()}
    </div>
  )
}