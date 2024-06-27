import React, { Ref, useEffect, useRef, useState } from "react";
import { KeyStroke } from "../../static/enums";

type TUseAutoCompleteProps = {
  delay?: number,
  source: (searchTerm: string, fetchLimit?: number) => Promise<any>;
  onChange?: (e: any) => void,
}

/**
 * useAutocomplete hook can be used by any sort of search functionality where we want to display a list
 * of results or suggestions, will debounce the input to prevent noise to the source endpoint
 */
export function useAutocomplete({ delay = 500, source, onChange }: TUseAutoCompleteProps) {
  const [autocompleteTimeout, setAutocompleteTimeout] = useState(setTimeout(() => {}, 0));
  const [busyTimeout, setBusyTimeout] = useState(setTimeout(() => {}, 0));
  const [isBusy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState<{ id: string; label: string }[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isActive, setActive] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [fetchLimit, setFetchLimit] = useState(5);
  const [canShowMoreResults, setCanShowMoreResults] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const optionHeight = listRef?.current?.children[0]?.clientHeight || 0;

  useEffect(() => {
    delayInvoke(() => {
      getSuggestions(textValue);
      setBusy(false);
    });
  }, [fetchLimit]);

  function delayInvoke(callback: () => void) {
    if (autocompleteTimeout) {
      clearTimeout(autocompleteTimeout);
    }
    setAutocompleteTimeout(setTimeout(callback, delay));
  }

  // cosmetic debounce, helps make the loading indicator less jittery
  function delayBusy(callback: () => void) {
    if (busyTimeout) {
      clearTimeout(busyTimeout);
    }
    setBusyTimeout(setTimeout(callback, 200));
  }

  function selectOption(index: number) {
    if (index > -1) {
      if (onChange) {
        onChange(suggestions[index]);
      }
      setTextValue(suggestions[index].label);
    }
    clearSuggestions();
  }

  async function getSuggestions(searchTerm: string) {
    if (searchTerm && source) {
      const sourceResults = await source(searchTerm, fetchLimit);
      setSuggestions(sourceResults.items);
      setNoResults(sourceResults.items.length === 0);
      setCanShowMoreResults(sourceResults.count > fetchLimit);
    }
  }

  function clearSuggestions() {
    setSuggestions([]);
    setSelectedIndex(-1);
  }

  function onTextChange(searchTerm: string) {
    if (searchTerm === '') {
      setBusy(false);
    } else {
      delayBusy(() => {
        setBusy(true);
      })
    }

    setNoResults(false);
    setTextValue(searchTerm);
    setFetchLimit(5);
    setCanShowMoreResults(false);
    clearSuggestions();
    delayInvoke(() => {
      getSuggestions(searchTerm);
      setBusy(false)
    });
  }

  function scrollUp() {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
    if (listRef.current) {
      listRef.current.scrollTop = optionHeight;
    }
  }

  function scrollDown() {
    if (selectedIndex < suggestions.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
    if (listRef.current) {
      listRef.current.scrollTop = selectedIndex * optionHeight;
    }
  }

  function pageDown() {
    setSelectedIndex(suggestions.length - 1);
    if (listRef.current) {
      listRef.current.scrollTop = suggestions.length * optionHeight;
    }
  }

  function pageUp() {
    setSelectedIndex(0);
    if (listRef.current) {
      listRef.current.scrollTop = 0
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {

    const keyOperation = {
      [KeyStroke.DOWN]: scrollDown,
      [KeyStroke.UP]: scrollUp,
      [KeyStroke.ENTER]: () => selectOption(selectedIndex),
      [KeyStroke.ESCAPE]: clearSuggestions,
      [KeyStroke.PAGEDOWN]: pageDown,
      [KeyStroke.PAGEUP]: pageUp,
    };

    let key = e.key as KeyStroke;

    // @ts-ignore
    if (keyOperation[key]) {
      // @ts-ignore
      keyOperation[key]();
    } else {
      setSelectedIndex(-1);
    }
  }

  function loadMoreResults(amount = 5) {
    setFetchLimit(fetchLimit + 5);
  }

  return {
    bindOption: {
      onClick: (e: React.MouseEvent<HTMLDivElement>) => {
        const eventTarget = e.target as HTMLDivElement | null;
        if (listRef.current && eventTarget) {
          const nodes = Array.from(listRef.current.children);
          // @ts-ignore - this is pissing me off
          selectOption(nodes.indexOf(eventTarget.closest('li')));
          setActive(true);
        }
      }
    },
    bindInput: {
      value: textValue,
      onChange: (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.target) {
          onTextChange((e?.target as HTMLInputElement)?.value);
        }
      },
    },
    bindOptions: {
      ref: listRef
    },
    bindContainer: {
      onClick: (e: React.MouseEvent<HTMLDivElement>) => {
        setActive(true);
      }
    },
    textValue,
    isBusy,
    isActive,
    noResults,
    suggestions,
    selectedIndex,
    canShowMoreResults,
    loadMoreResults,
    setActive,
  }
}