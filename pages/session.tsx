import { GetServerSidePropsContext } from 'next';
import { useAppContext } from '../components/appProvider';
import { StudioLayout } from "../components/layouts";
import { getSession } from "next-auth/react";


function Session(props: any) {
  console.log(props.session)

  return (
    <StudioLayout>
    <div>
        TESTING
      </div>
    </StudioLayout>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const dev = process.env.NODE_ENV !== 'production';
  const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';
  const session = await getSession(context);

  const results = await fetch(`${server}/api/session`, {
    method: 'GET',
    headers: {
      cookie:
    }
  });
  const json = await results.json();
  console.log(json);

  return {
    props: {
      session,
    }
  };

};

// Session.requireAuth = true;
export default Session;
