import { useAppContext } from '../../appProvider';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { TrashToolbar } from './trashToolbar';
import { ProjectsToolbar } from './projectsToolbar';
import { ProjectFilters } from '../../../store/';

type TStudioToolbarButton = {
  label?: string, onClick: () => void, disabled: boolean,
  icon?: React.ReactElement,
};

export const BaseStudioToolbar = observer(() => {
  const {
    store
  } = useAppContext();

  const renderToolarType = () => {
    switch(store.studioStore.projectFilter) {
      case ProjectFilters.ALL:
        return <ProjectsToolbar/>;
      case ProjectFilters.TRASHED:
        return <TrashToolbar/>;
      case ProjectFilters.ARCHIVED:
        return null;
    }
  };

  return (
    <div className={'studio-toolbar'}>
      {renderToolarType()}
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
           if (!disabled) {
              onClick();
           }
         }
    }>
      {renderIcon()}
      {renderLabel()}
    </div>
  );
};