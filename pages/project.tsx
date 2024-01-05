import { useEffect, useState } from 'react';
import { ProjectItem } from '../components/projectFeed/projectItem';
import { ProjectFeedEvents } from '../static/events';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { GetServerSidePropsContext } from 'next';
import { getProjects, deleteProject } from './api/handlers/projectApiHandler';
import { BaseLayout } from '../components/layouts';
import { Project } from '@prisma/client';

export default function Project(props: any) {
  const [projects, setProjects] = useState(props.projects);

  useEffect(() => {
    document.addEventListener(ProjectFeedEvents.PROJECT_FEED_UPDATED, () => {
      getProjects().then((projects) => {
        setProjects(projects);
      });
    });
  }, []);

  const renderProjectFeed = () => {
    return projects.map((project: Project) => {
      return <ProjectItem key={project.id} data={project}/>;
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
