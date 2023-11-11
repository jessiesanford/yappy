import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import {FixedSizeList, VariableSizeList} from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import { getProjects } from '../api/project/projectApiHandler';
import { GhostProjectItem, ProjectItem } from '../../components/projectFeed/projectItem';
import { useAppContext } from '../../components/appProvider';
import { ProjectFeedEvents } from '../../static/events';
import { ProjectFilters } from '../../store/studioStore';
import { TProjectItem } from '../../types/projectTypes';
import { CreateProjectModal } from '../../components/studio/createProjectModal';

export const ProjectFeed = observer(() => {
  const {
    store
  } = useAppContext();

  const [projects, setProjects] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  function handleProjectFeedUpdated() {
    getProjects().then((projects) => {
      setTimeout(() => {
        projects = projects.sort((a: TProjectItem, b: TProjectItem) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

        switch (store.Studio.projectFilter) {
          case ProjectFilters.ALL:
            projects = projects.filter((project: TProjectItem) => {
              return !project.isTrashed;
            });
            break;
          case ProjectFilters.TRASHED:
            projects = projects.filter((project: TProjectItem) => {
              return project.isTrashed;
            });
        }
        setProjects(projects);
        setProjectsLoaded(true);
      }, 500);
    });
  }

  function fetchMoreProjects() {

  }

  useEffect(() => {
    document.addEventListener(ProjectFeedEvents.PROJECT_FEED_UPDATED, handleProjectFeedUpdated);
    return () => {
      document.removeEventListener(ProjectFeedEvents.PROJECT_FEED_UPDATED, handleProjectFeedUpdated);
    };
  }, []);

  // load projects in
  useEffect(() => {
    handleProjectFeedUpdated();
  }, [store.Studio.projectFilter]);

  const renderProjectFeed = () => {
    if (projects.length === 0) {
      return <EmptyProjectFeedDisplay/>;
    }
    return projects.map((projectItem: ProjectItem) => {
      return <ProjectItem key={projectItem.id} data={projectItem}/>;
    });

    // let containerHeight = document.querySelector('.sfds');

    // return (
      // <AutoSizer>
      //   {({ height, width }) => {
      //     return projectItems;
      //   }}
      // </AutoSizer>
      // <VariableSizeList
      //   height={1000} // Set the height of the list
      //   width="100%" // Set the width to 100% to fill the parent element
      //   itemCount={projectItems.length}
      //   itemSize={(index) => 80}
      // >
      //   {({ index, style }) => (
      //     <div style={style}>
      //       {projectItems[index]}
      //     </div>
      //   )}
      // </VariableSizeList>
    // )
  };

  return (
    <div className={'project-list'}>
      {!projectsLoaded ? <GhostProjectFeed/> : renderProjectFeed()}
    </div>
  );
});

const GhostProjectFeed = () => {
  const ghostProjects = [];
  for (let i = 0; i <= 5; i++) {
    ghostProjects.push(<GhostProjectItem key={i} />)
  }
  return (
    <>
      {ghostProjects}
    </>
  );
};

const EmptyProjectFeedDisplay = () => {
  const {
    store
  } = useAppContext();

  const MODAL_STORE = store.Modal;

  return (
    <div className={'empty-project-feed'}>
      <div className={'empty-project-feed__heading'}>
        You have no projects :(
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className={'outlined'}onClick={() => MODAL_STORE.showModal(CreateProjectModal, {})}>Create New Project</button>
      </div>
    </div>
  );
};