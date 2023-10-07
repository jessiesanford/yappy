import React from 'react';

export const useOutsideClick = (callback) => {
  const ref = React.useRef();

  React.useEffect(() => {
    const handleClick = (event: Event) => {
      const el: React.RefObject<HTMLDivElement> = ref.current;
      if (el && !el?.contains(event.target)) {
        callback(event);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [ref]);

  return ref;
};