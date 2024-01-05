import { ReactElement, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useModalContext } from './modalProvider';
import { makeDraggable } from '../../util/baseUtils';
import { useAppContext } from '../appProvider';

type BaseModalProps = {
  title?: string;
  children: JSX.Element | JSX.Element[];
  action?: () => Promise<{ success: boolean; }>;
  cancel?: () => void;
  renderModalHeading?: () => ReactElement;
  renderModalControls?: () => ReactElement;
  actionLabel?: string;
};

export const BaseModal = observer((props: BaseModalProps) => {
  const {
    store
  } = useAppContext();

  const {
    doAction,
    doCancel,
    handleKeyDown,
  } = useModalContext();

  const MODAL_STORE = store.Modal;

  const scrimRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    };
  }, []);

  useEffect(() => {
    // fadein
    setTimeout(() => {
      if (scrimRef.current) {
        scrimRef.current.style.opacity = '1';
      }
      if (modalRef.current) {
        modalRef.current.style.opacity = '1';
      }
    }, 0);
  }, []);

  useEffect(() => {
    makeDraggable('.modal', '.modal-heading');
    handleAfterOpen();
  }, []);

  function handleModalClosing() {
    MODAL_STORE.setError({ msg: '', hidden: true });
  }

  function handleAfterOpen() {
    const modal = modalRef.current;
    const windowHeight = window.innerHeight;
    if (modal) {
      const modalHeight = modal.clientHeight;
      modal.style.top = `${(windowHeight / 2) - (modalHeight / 2)}px`;
    }
  }

  const doModalAction = async () => {
    handleModalClosing();
    if (props.action) {
      const results = await props.action();
      if (results.success) {
        doAction();
      }
    } else {
      doAction();
    }
  };

  const doModalCancel = () => {
    handleModalClosing();
    if (props.cancel) {
      props.cancel();
      doCancel();
    } else {
      doCancel();
    }
  };

  const renderModalHeading = () => {
    if (props.renderModalHeading) {
      return props.renderModalHeading();
    }

    return (
      <div className={'modal-heading'} ref={headingRef}>
        <div className={'modal-title'}>
          {props.title}
        </div>
      </div>
    );
  };

  const renderModalControls = () => {
    if (props.renderModalControls) {
      return props.renderModalControls();
    }

    return (
      <div className={'modal-controls'}>
        <div className={'left-controls'}>

        </div>
        <div className={'right-controls'}>
          <button className={'action-btn cancel'} onClick={doModalCancel}>Cancel</button>
          <button className={'action-btn confirm-action'} onClick={doModalAction}>{props.actionLabel ? props.actionLabel : 'Ok'}</button>
        </div>
      </div>
    );
  };

  const renderModalErrorContainer = () => {
    return (
      <div className={'modal-error-container'}
           style={{
             color: "#db5252",
             padding: "20px",
             fontWeight: "bold",
             textAlign: "center",
             display: MODAL_STORE.error?.hidden ? "none" : "block"
           }}
      >
        {MODAL_STORE.error?.msg}
      </div>
    );
  };

  return (
    <div className={'modal-scrim'} ref={scrimRef}>
      <div className={'modal'} ref={modalRef}>
        {renderModalHeading()}
        {props.children}
        {renderModalControls()}
        {renderModalErrorContainer()}
      </div>
    </div>
  );
});