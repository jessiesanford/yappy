import { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import StudioLayout from '../components/layouts/studioLayout';
import { AccountService } from '../services/accountService';
import { useEffect } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';



export default function Account({ account } : { account: AccountService } ) {
  const { data: session } = useSession();
  const ACCOUNT = new AccountService(session?.user);
  let user;

  useEffect(() => {
    ACCOUNT.init().then(() => {
      user = ACCOUNT;
    });
  }, []);

  if (!account) {
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
      </div>
    </StudioLayout>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // const session = await getServerSession(context.req, context.res, authOptions);
  const session = await getSession(context);
  let accountService;

  if (session) {
    accountService = new AccountService(session.user.id);
    await accountService.init();
  }

  return {
    props: {
      accountService,
    }
  };
}