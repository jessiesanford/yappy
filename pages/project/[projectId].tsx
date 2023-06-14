import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

export default function Project({ session, project }) {
  const router = useRouter();
  console.log(project);

  return (
    <div>
      My post {project.name}
    </div>
  );
}


export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const query = context.query;

  const dev = process.env.NODE_ENV !== 'production';
  const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';

  const results = await fetch(`${server}/api/project/${query.projectId}`, {
    method: 'GET',
  });
  const project = await results.json();

  if (session) {
    return {
      props: {
        session,
        project,
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