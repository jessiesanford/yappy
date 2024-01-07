import { observer } from 'mobx-react-lite';
import { useAppContext } from '../appProvider';
import { ReactElement, useCallback, useEffect, useRef } from 'react';
import { useOutsideClick } from '../hooks/useClickOutside';
import { isDescendant } from "../../util/baseUtils";

type TContextMenuOptionProps = {
  icon?: ReactElement;
  label: string;
  onClick: () => void
}

export const ContextMenu = observer(() => {
  const {
    store
  } = useAppContext();

  const {
    position,
    hidden,
    destroy,
    reposition,
  } = store.ContextMenu;

  const contextMenuRef = useRef<HTMLDivElement>(null);

  function handleWindowResize() {
    reposition();
  }

  useEffect(() => {
    if (contextMenuRef.current) {
      const BB = contextMenuRef.current.getBoundingClientRect();
      if (BB.bottom > window.innerHeight) {
        // if the contextmenu is outside the y-boundary of the window, adjust the y-position
        store.ContextMenu.setPosition({ x: position.x, y: window.innerHeight - BB.height - 20});
      }
    }
  }, [position]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const handleClickOutside = useCallback((e: Event) => {
    if (!isDescendant(e.target, store.contextMenuStore.target)) {
      store.ContextMenu.destroy();
    }
  }, []);

  useOutsideClick(contextMenuRef, handleClickOutside);

  const style = {
    left: `${position?.x}px`,
    top: `${position?.y}px`,
  };

  if (!hidden) {
    return (
      <div className={'context-menu'}
           ref={contextMenuRef}
           style={style}
      >
        <div>
          {store.ContextMenu.options.map(opt => <ContextMenuOption key={opt.id} {...opt}/>)}
        </div>
      </div>
    );
  }

  return null;
});

export const ContextMenuOption = (props: Partial<TContextMenuOptionProps>) => {
  return (
    <div className={'context-menu__option'} onClick={props.onClick}>
      <div className={'context-menu__option-icon'}>
        {props.icon}
      </div>
      <div>
        {props.label}
      </div>
    </div>
  );
};