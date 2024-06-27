import { useEffect, RefObject } from 'react';

export const useOutsideClick = <T extends HTMLElement>(ref: RefObject<T>, callback: (event: MouseEvent) => void) => {
  const handleClickOutside = (event: MouseEvent) : void => {
    // Check if the click is outside the referenced element
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback(event);
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, callback]);
};