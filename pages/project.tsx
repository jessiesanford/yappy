import { createContext, useContext, useEffect, useState } from 'react';
import { ProjectItem } from '../components/projectFeed/projectItem';
import { ProjectFeedEvents } from '../static/events';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { GetServerSidePropsContext } from 'next';
import { ProjectFeedMock } from '../static/projectMocks';
import { getProjects, deleteProject } from './api/project/projectApiHandler';
import { useAppContext } from '../components/appProvider';
import { BaseLayout } from '../components/layouts';

export default function Project(props: any) {
  const {
    store,
  } = useAppContext();

  const [projects, setProjects] = useState(props.projects);

  useEffect(() => {
    document.addEventListener(ProjectFeedEvents.PROJECT_FEED_UPDATED, () => {
      getProjects().then((projects) => {
        setProjects(projects);
      });
    });
  }, []);

  const renderProjectFeed = () => {
    return projects.map((projectItem) => {
      return <ProjectItem key={projectItem.id} data={projectItem}/>;
    });
  };

  return (
    <BaseLayout>
      <div className={'project-list'}>
        {renderProjectFeed()}
      </div>
    </BaseLayout>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const dev = process.env.NODE_ENV !== 'production';
  const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';

  const results = await fetch(`${server}/api/project/get`, {
    method: 'GET',
  });
  const projects = await results.json();

  if (session) {
    return {
      props: {
        session,
        projects,
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
