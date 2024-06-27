import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { getProjects } from '../../pages/api/handlers/projectApiHandler';
import { GhostProjectItem, ProjectItem } from './projectItem';
import { useAppContext } from '../appProvider';
import { ProjectFeedEvents } from '../../static';
import { ProjectFilters } from '../../store';
import { CreateProjectModal } from '../studio';
import { Project } from '@prisma/client';
import { io } from 'socket.io-client';

// TODO: implement real time updates with socket.io
// const socket = io('http://localhost:3001');

export const ProjectFeed = observer(() => {
  const {
    store
  } = useAppContext();

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  function handleProjectFeedUpdated() {
    getProjects().then((projects) => {
      setTimeout(() => {
        projects = projects.sort((a: Project, b: Project) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

        switch (store.Studio.projectFilter) {
          case ProjectFilters.ALL:
            projects = projects.filter((project: Project) => {
              return !project.isTrashed;
            });
            break;
          case ProjectFilters.TRASHED:
            projects = projects.filter((project: Project) => {
              return project.isTrashed;
            });
        }
        setProjects(projects);
        setProjectsLoaded(true);
      }, 500);
    });
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
    return projects.map((project: Project) => {
      return <ProjectItem key={project.id} data={project}/>;
    });

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
    ghostProjects.push(<GhostProjectItem key={i} />);
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