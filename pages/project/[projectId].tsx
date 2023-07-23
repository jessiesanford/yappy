import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { StudioLayout } from '../../components/layouts/';

export default function Project({ project }) {
  const router = useRouter();

  return (
    <StudioLayout>
      <div style={{ padding: '20px' }}>
        My post {project.name}
      </div>
    </StudioLayout>
  );
}


export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const query = context.query;

  const dev = process.env.NODE_ENV !== 'production';
  const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';

  const results = await fetch(`${server}/api/project/${query.projectId}`, {
    method: 'GET',
  });
  const project = await results.json();

  return {
    props: {
      project,
    }
  };
};