import { StudioToolbarButton } from './baseStudioToolbar';
import { FiRotateCcw, FiTrash } from 'react-icons/fi';
import { deleteProjects, restoreProjects } from '../../../pages/api/handlers/projectApiHandler';
import React from 'react';
import { useAppContext } from '../../appProvider';
import { observer } from "mobx-react-lite";

export const TrashToolbar = observer(() => {
  const {
    store
  } = useAppContext();

  const STUDIO_STORE = store.studioStore;

  return (
    <div className={'studio-toolbar'}>
      <StudioToolbarButton
        icon={<FiTrash/>}
        onClick={() => {
          STUDIO_STORE.setProcessingStatus(true, 'Deleting Projects');
          deleteProjects(STUDIO_STORE.selectedProjectItems).then(() => {
            STUDIO_STORE.resetProcessingStatus();
          });
        }}
        disabled={STUDIO_STORE.selectedProjectItems.length === 0}
      />
      <StudioToolbarButton
        icon={<FiRotateCcw/>}
        onClick={() => {
          restoreProjects(STUDIO_STORE.selectedProjectItems);
        }}
        disabled={STUDIO_STORE.selectedProjectItems.length === 0}
      />
    </div>
  );
});