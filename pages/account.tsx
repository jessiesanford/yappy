import { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import StudioLayout from '../components/layouts/studioLayout';
import { AccountService } from '../services/accountService';
import { useEffect, useState } from 'react';
import { getUsersById } from './api/user/userApiHandler';
import { User } from 'next-auth';

export default function Account({ user }: { user: User }) {
  const [account, setAccount] = useState<AccountService>();

  useEffect(() => {
    getUsersById(user?.id).then((users) => {
      if (users.length > 0) {
        setAccount(new AccountService(users[0]));
      }
    });
  }, []);

  const renderAccountLoading = () => {
    return (
      <div>
        Account Loading
      </div>
    );
  };

  const renderAccountSettings = () => {
    return (
      <>
        <div className={'info-row'}>
          <div className={'info-row__header'}>
            Full Name
          </div>
          <div className={'info-row__value'}>
            {account.Name}
          </div>
        </div>
        <div className={'info-row'}>
          <div className={'info-row__header'}>
            Handle
          </div>
          <div className={'info-row__value'}>
            {account.Handle}
          </div>
        </div>
        <div className={'info-row'}>
          <div className={'info-row__header'}>
            Email
          </div>
          <div className={'info-row__value'}>
            {account.Email}
          </div>
        </div>
      </>
    )
  }

  return (
    <StudioLayout title={'Account'}>
      <div className={'account-container'}>
        {!account ? renderAccountLoading() : renderAccountSettings()}
      </div>
    </StudioLayout>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  return {
    props: {
      user: session.user,
    }
  };
}