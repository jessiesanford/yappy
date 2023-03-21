import { useSession, signIn, signOut } from "next-auth/react";
import StudioLayout from '../components/layouts/studioLayout';
import { createContext, useContext, useEffect, useState } from 'react';
import { ProjectItem } from '../components/projectFeed/projectItem';
import { ProjectFeedEvents, ProjectFeedUpdated } from '../static/events';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { GetServerSidePropsContext } from 'next';
import { ProjectFeedMock } from "../static/projectMocks";

const ProjectFeedContextProps = {
  getProjects: () => {
  },
  setProjects: () => {
  },
  deleteProject: () => {
  },
};

export const ProjectFeedContext = createContext(ProjectFeedContextProps);
export const useProjectFeedContext = () => useContext(ProjectFeedContext);

const getProjects = async () => {
  const dev = process.env.NODE_ENV !== 'production';
  const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';

  const results = await fetch(`${server}/api/project/get`, {
    method: 'GET',
  });
  return await results.json();
}

const deleteProject = async (id: number) => {
  await fetch('/api/project/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id
    }),
  });
  ProjectFeedUpdated();
};

export default function Studio(props) {
  // const { data: session } = useSession();
  const [projects, setProjects] = useState(ProjectFeedMock);

  useEffect(() => {
    document.addEventListener(ProjectFeedEvents.PROJECT_FEED_UPDATED, () => {
      getProjects().then((projects) => {
        setProjects(ProjectFeedMock.concat(projects));
      });
    });
  }, []);

  const renderProjectFeed = () => {
    return projects.map((projectItem) => {
      return <ProjectItem key={projectItem.id} data={projectItem}/>
    });
  };

  return (
    <ProjectFeedContext.Provider value={{ getProjects: getProjects, setProjects, deleteProject }}>
      <StudioLayout>
        <div className={'project-list'}>
          {renderProjectFeed()}
        </div>
      </StudioLayout>
    </ProjectFeedContext.Provider>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      props: {
        session
      }
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      }
    };
  }

};
