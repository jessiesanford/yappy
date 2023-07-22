import { observer } from 'mobx-react-lite';
import { useAppContext } from '../appProvider';
import { useCallback, useRef } from 'react';
import { useOutsideClick } from '../../helpers/reactUtils';

export const ContextMenu = observer(() => {
  const {
    store
  } = useAppContext();

  const handleClickOutside = useCallback(() => {
    store.ContextMenu.destroy();
  }, []);

  const contextMenuRef = useOutsideClick(handleClickOutside);

  const style = {
    left: `${store.ContextMenu.position?.x}px`,
    top: `${store.ContextMenu.position?.y}px`,
  };

  if (!store.ContextMenu.hidden) {
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

export const ContextMenuOption = (props) => {
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