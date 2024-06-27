import StudioLayout from '../components/layouts/studioLayout';
import { createContext, useContext, useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { deleteProject } from './api/handlers/projectApiHandler';
import { useAppContext } from '../components/appProvider';
import { BaseStudioToolbar } from '../components/studio/toolbar/baseStudioToolbar';
import { AppPages } from "../static/enums";
import { ProjectFeed } from "../components/projectFeed/projectFeed";

interface IProjectFeedContext {
  deleteProject: (id: number) => Promise<void>;
}

const ProjectFeedContextProps = {
  deleteProject: deleteProject,
};

export const ProjectFeedContext = createContext<IProjectFeedContext>(ProjectFeedContextProps);

function Studio(props: any) {
  const {
    store,
  } = useAppContext();

  const provided = {
    deleteProject,
  };

  const generateSubView = () => {
    switch (store.Studio.currentPage) {
      case AppPages.PROJECTS:
        return <ProjectFeed/>;
      case AppPages.SETTINGS:
        return <div>Settings</div>;
      case AppPages.TRASH:
      default:
        return <div>Project</div>;
    }
  }

  return (
    <ProjectFeedContext.Provider value={provided}>
      <StudioLayout>
        <BaseStudioToolbar/>
        {generateSubView()}
      </StudioLayout>
    </ProjectFeedContext.Provider>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const dev = process.env.NODE_ENV !== 'production';
  const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';

  const results = await fetch(`${server}/api/project/all`, {
    method: 'GET',
  });
  const projects = await results.json();

  return {
    props: {
      projects,
    }
  };

};

Studio.requireAuth = true;
export default Studio;
