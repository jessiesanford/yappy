import { searchUserProjects } from '../../pages/api/handlers/projectApiHandler';
import { useAutocomplete } from '../hooks/useAutocomplete';
import { LoadingSpinner2 } from './loading';
import { FiSearch } from 'react-icons/fi';
import { useRef } from 'react';
import { useOutsideClick } from '../hooks/useClickOutside';
import { isDescendant } from '../../util/baseUtils';
import { useRouter } from 'next/router';

type TProjectFeedSearchProps = {}

export function ProjectFeedSearch(props: TProjectFeedSearchProps) {
  const {
    bindInput,
    bindOptions,
    bindOption,
    bindContainer,
    noResults,
    isBusy,
    isActive,
    suggestions,
    selectedIndex,
    canShowMoreResults,
    loadMoreResults,
    setActive
  } = useAutocomplete({
    onChange: (value) => console.log(value),
    source: async (searchQuery, fetchLimit) => {
      try {
        const data = await searchUserProjects(searchQuery, fetchLimit);
        return {
          items: data.projects.map((d: { id: string, name: string }) => ({id: d.id, label: d.name})),
          count: data.count,
        };
      } catch (e) {
        return {
          items: [],
          count: 0,
        };
      }
    }
  });

  const containerRef = useRef(null);
  const router = useRouter();

  const queryContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(queryContainerRef, (e) => {
    const clickTarget = e.target;
    if (!isDescendant(clickTarget, containerRef.current)) {
      setActive(false);
    }
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const renderIcon = () => {
    return (
      <div className={'autocomplete-icon'}>
        <FiSearch/>
      </div>
    );
  };

  const renderLoadMoreElement = () => {
    return (
      <div className={'load-more'}
           onClick={() => loadMoreResults(5)}
      >
        Load More...
      </div>
    );
  };

  const renderResults = () => {
    if (isActive) {
      let resultItems;

      if (suggestions.length > 0) {
        resultItems = suggestions.map((item, index) => (
          <div
            key={index}
            className={`result-container ${(selectedIndex === index && 'active')}`}
            onClick={(e) => {
              bindOption.onClick(e);
              router.push(`/project/${item.id}`);
            }}
          >
            <div className="flex items-center space-x-1">
              <div>{suggestions[index].label}</div>
            </div>
          </div>
        ));
        if (canShowMoreResults) {
          resultItems.push(renderLoadMoreElement());
        }
      }

      return (
        <div className="autocomplete-results" {...bindOptions}>
          {resultItems}
          {noResults ? <div className={'result-container'}>No Results Found.</div> : null}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={'autocomplete'}
         ref={containerRef}
         onClick={(e) => {
           if (inputRef.current) {
             inputRef.current?.focus();
           }
           bindContainer.onClick(e);
         }}
    >
      <div className={`autocomplete-query ${isActive ? 'active' : null}`}>
        {renderIcon()}
        <div className={'autocomplete-textbox'} ref={queryContainerRef}>
          <input type={'text'}
                 placeholder={'Search for projects...'}
                 ref={inputRef}
                 // @ts-ignore - event types are different here when compared to the hook I guess, can't figure it out right now
                 onChange={bindInput.onChange}
                 value={bindInput.value}
          />
        </div>
        <div className={'autocomplete-status'}>
          {isBusy ? <LoadingSpinner2 size={'12px'} color={'#a0a0a0'}/> : null}
        </div>
      </div>
      {renderResults()}
    </div>
  );
}