import React, {useEffect, useRef, useState} from "react";
import {KeyCodes} from "../../static/enums";

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
  const listRef = useRef();
  const optionHeight = listRef?.current?.children[0]?.clientHeight

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
      onChange(suggestions[index]);
      setTextValue(suggestions[index].label);
    }
    clearSuggestions();
  }

  async function getSuggestions(searchTerm: string) {
    if (searchTerm && source) {
      const sourceResults = await source(searchTerm, fetchLimit);
      setSuggestions(sourceResults.items);
      setNoResults(sourceResults.items.length === 0)
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
    listRef.current.scrollTop = optionHeight
  }

  function scrollDown() {
    if (selectedIndex < suggestions.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
    listRef.current.scrollTop = selectedIndex * optionHeight
  }

  function pageDown() {
    setSelectedIndex(suggestions.length - 1)
    listRef.current.scrollTop = suggestions.length * optionHeight
  }

  function pageUp() {
    setSelectedIndex(0)
    listRef.current.scrollTop = 0
  }

  function onKeyDown(e) {
    const keyOperation = {
      [KeyCodes.DOWN_ARROW]: scrollDown,
      [KeyCodes.UP_ARROW]: scrollUp,
      [KeyCodes.ENTER]: () => selectOption(selectedIndex),
      [KeyCodes.ESCAPE]: clearSuggestions,
      [KeyCodes.PAGE_DOWN]: pageDown,
      [KeyCodes.PAGE_UP]: pageUp,
    }
    if (keyOperation[e.keyCode]) {
      keyOperation[e.keyCode]()
    } else {
      setSelectedIndex(-1)
    }
  }

  function loadMoreResults(amount = 5) {
    setFetchLimit(fetchLimit + 5);
  }

  return {
    bindOption: {
      onClick: (e: MouseEvent) => {
        let nodes = Array.from(listRef.current.children);
        selectOption(nodes.indexOf(e.target.closest("li")));
        setActive(true);
      }
    },
    bindInput: {
      value: textValue,
      onChange: (e: Event) => {
        if (e.target) {
          onTextChange(e?.target?.value);
        }
      },
      onKeyDown
    },
    bindOptions: {
      ref: listRef
    },
    bindContainer: {
      onClick: (e: MouseEvent) => {
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