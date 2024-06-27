import { CreateProjectModal } from '../index';
import { FiPlusCircle, FiTrash } from 'react-icons/fi';
import { searchUserProjects, trashProjects } from '../../../pages/api/handlers/projectApiHandler';
import React from 'react';
import { StudioToolbarButton } from './baseStudioToolbar';
import { useAppContext } from '../../appProvider';
import { observer } from 'mobx-react-lite';
import { Autocomplete } from '../../reusable/autocomplete';
import {ProjectFeedSearch} from "../../reusable/projectFeedSearch";

export const ProjectsToolbar = observer(() => {
  const {
    store
  } = useAppContext();

  const MODAL_STORE = store.Modal;
  const STUDIO_STORE = store.studioStore;

  return (
    <div className={'studio-toolbar'}>
      <StudioToolbarButton
        icon={<FiPlusCircle/>}
        onClick={() => MODAL_STORE.showModal(CreateProjectModal, {})}
        disabled={false}
      />
      <StudioToolbarButton
        icon={<FiTrash/>}
        onClick={() => {
          STUDIO_STORE.setProcessingStatus(false, 'Deleting Projects');
          trashProjects(STUDIO_STORE.selectedProjectItems).then(() => {
            STUDIO_STORE.resetProcessingStatus(500);
          });
        }}
        disabled={store.Studio.selectedProjectItems.length === 0}
      />
      <div style={{ marginLeft: 'auto' }}>
        <ProjectFeedSearch/>
      </div>
    </div>
  );
});