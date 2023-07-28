import { CreateProjectModal } from '../createProjectModal';
import { FiTrash } from 'react-icons/fi';
import { trashProjects } from '../../../pages/api/project/projectApiHandler';
import React from 'react';
import { StudioToolbarButton } from './baseStudioToolbar';
import { useAppContext } from '../../appProvider';
import { observer } from 'mobx-react-lite';

export const ProjectsToolbar = observer(() => {
  const {
    store
  } = useAppContext();

  const MODAL_STORE = store.Modal;
  const STUDIO_STORE = store.studioStore;

  return (
    <div className={'studio-toolbar'}>
      <button
        className={'create-project'}
        onClick={() => {
          MODAL_STORE.showModal(CreateProjectModal, {});
        }
        }>
        Create Project
      </button>
      <StudioToolbarButton
        icon={<FiTrash/>}
        onClick={() => {
          trashProjects(STUDIO_STORE.selectedProjectItems);
        }}
        disabled={store.Studio.selectedProjectItems.length === 0}
      />
    </div>
  );
});