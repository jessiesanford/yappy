// import { useSession, signIn, signOut } from "next-auth/react";
import StudioLayout from '../components/layouts/studioLayout';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { GetServerSidePropsContext } from 'next';
import { useAppContext } from '../components/appProvider';
import { TeamTable } from '../components/team/teamTable';


export default function Studio(props: any) {
  const {
    store,
  } = useAppContext();

  return (
    <StudioLayout>
      <TeamTable>

      </TeamTable>
    </StudioLayout>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return {
    props: {
    }
  };
};
