import { useEffect, useRef } from 'react';
import { KeyNames } from '../../util/enums';
import { useModalContext } from './modalProvider';
import { makeDraggable } from '../../util/baseUtils';

type BaseModalProps = {
  title?: string;
  children: JSX.Element | JSX.Element[];
  action?: () => void;
};

export const BaseModal = (props: BaseModalProps) => {
  const { hideModal } = useModalContext();
  const scrimRef = useRef(null);
  const headingRef = useRef(null);
  const modalRef = useRef(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === KeyNames.ESCAPE) {
      hideModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    };
  }, []);

  useEffect(() => {
    if (scrimRef.current) {
      scrimRef.current.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    }
  }, []);

  useEffect(() => {
    makeDraggable('.modal', '.modal-heading', );
  }, []);

  const doModalAction = () => {
    if (props.action) {
      props.action();
    }
    hideModal();
  };

  const closeModal = () => {
    hideModal();
  };

  return (
    <div className={'modal-scrim'} ref={scrimRef}>
      <div className={'modal'} ref={modalRef}>
        <div className={'modal-heading'} ref={headingRef}>
          <div className={'modal-title'}>
            {props.title}
          </div>
          <div className={'modal-close-anchor'} onClick={closeModal}>
            <i className={'fa fa-close'} />
          </div>
        </div>
        {props.children}
        <div className={'modal-controls'}>
          <div className={'left-controls'}>

          </div>
          <div className={'right-controls'}>
            <button onClick={closeModal}>Cancel</button>
            <button onClick={doModalAction}>Ok</button>
          </div>
        </div>
      </div>
    </div>
  );
};