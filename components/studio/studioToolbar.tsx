import { useAppContext } from '../appProvider';
import { observer } from 'mobx-react-lite';
import { FiMoreVertical } from 'react-icons/fi';
import { FiTrash } from 'react-icons/fi';
import React from 'react';
import { IconType } from 'react-icons';
import { CreateProjectModal } from './createProjectModal';
import { useModalContext } from '../modal/modalProvider';

type TStudioToolbarButton = {
  label: string, onClick: () => void, disabled: boolean,
  icon?: React.ReactElement,
};

export const StudioToolbar = observer(() => {
  const {
    store
  } = useAppContext();

  const {
    showModal
  } = useModalContext();

  return (
    <div className={'studio-toolbar'}>
      <button
        className={'create-project'}
        onClick={() => {
          showModal(CreateProjectModal);
        }
        }>
        Create Project
      </button>
      <StudioToolbarButton
        icon={<FiTrash/>}
        onClick={() => {}}
        disabled={store.Studio.selectedProjectItems.length === 0}
      />
    </div>
  );
});

export const StudioToolbarButton = ({ label, icon, onClick, disabled }: TStudioToolbarButton) => {
  const renderIcon = () => {
    if (icon) {
      return icon;
    } else {
      return null;
    }
  };

  const renderLabel = () => {
    if (label) {
      return label;
    } else {
      return null;
    }
  };

  return (
    <div className={`studio-toolbar__button ${disabled ? 'disabled' : ''}`}
         onClick={() => {
           if (disabled) {
            alert('ueahj buddy');
           }
         }
    }>
      {renderIcon()}
      {renderLabel()}
    </div>
  );
};