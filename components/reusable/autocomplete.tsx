import { useEffect, useState, ReactElement, useRef } from 'react';
import { isDescendant } from '../../util/baseUtils';
import { useOutsideClick } from '../hooks/useClickOutside';
import { LoadingSpinner2 } from './loading';
import { FiSearch } from 'react-icons/fi';

type TAutocompleteProps = {
  searchFunction: (queryString: string, limit: number) => any,
  placeholder?: string,
  icon?: ReactElement,
}

// DEPRECIATED
export function Autocomplete(props: TAutocompleteProps) {
  const [active, setActive] = useState(false);
  const [queryString, setQueryString] = useState('');
  const [results, setResults] = useState<Array<{ id: string, name: string }>>([]);
  const [fetching, setFetching] = useState(false);
  const [fetchLimit, setFetchLimit] = useState(5);
  const [queryEnd, setQueryEnd] = useState(false);

  useEffect(() => {
    setFetching(false);
  }, []);

  useEffect(() => {
    if (queryString === '') {
      // we treat an empty string as the default blank state
      setResults([]);
      setFetching(false);
      setFetchLimit(5);
      setQueryEnd(false);
    } else if (active) {
      setFetching(true);
      setQueryEnd(false);

      const debounceTimeout = setTimeout(async () => {
        await generateResults();
      }, 300);

      return () => {
        clearTimeout(debounceTimeout);
      };
    }
  }, [queryString, fetchLimit, active]);

  const containerRef = useRef(null);
  const queryContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(queryContainerRef, (e: Event) => {
    const clickTarget = e.target;
    if (!isDescendant(clickTarget, containerRef.current)) {
      setActive(false);
    }
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const generateResults = async () => {
    if (queryString === '') {
      setResults([]);
    } else {
      const data = await props.searchFunction(queryString, fetchLimit);
      setResults((prevState) => {
        if (results.length === data.projects.length || data.projects.length < fetchLimit) {
          setQueryEnd(true);
        }
        return data.projects;
      });
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
      if (results.length > 0) {
        return (
          <div className={'autocomplete-results'}>
            {results.map((result) => {
              return (
                <div key={result.id} className={'result-container'}>
                  {result.name}
                </div>
              )
            })}
            {(results.length > 0 && !queryEnd) ? <div className={'result-container'} onClick={() => setFetchLimit(fetchLimit + 5)}>Load More Results...</div> : null}
          </div>
        );
      } else if (results.length === 0 && queryString !== '' && !fetching) {
        return (
          <div className={'autocomplete-results'}>
            <div className={'result-container'}>No results found.</div>
          </div>
        )
      }
    } else {
      return null;
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