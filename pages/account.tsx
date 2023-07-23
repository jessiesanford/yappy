import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import StudioLayout from '../components/layouts/studioLayout';

export default function Account() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <StudioLayout title={'Account'}>
      <div className={'account-container'}>
        <div className={'info-row'}>
          <div className={'info-row__header'}>
            Full Name
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
    </StudioLayout>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return {
    props: {
    }
  };
}