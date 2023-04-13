import BaseLayout from '../components/layouts/baseLayout';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';

export default function Account() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <BaseLayout title={'Account'}>
      <div className={'account-container'}>
        <div className={'info-row'}>
          <div className={'info-row__header'}>
            Handle
          </div>
          <div className={'info-row__value'}>
            {user.name}
          </div>
        </div>
        <div className={'info-row'}>
          <div className={'info-row__header'}>
            Email
          </div>
          <div className={'info-row__value'}>
            {user.email}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      props: {
        session,
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
}