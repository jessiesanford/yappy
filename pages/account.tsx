import StudioLayout from '../components/layouts/studioLayout';
import { AccountService } from '../services/accountService';
import { useEffect, useState } from 'react';
import { getUsersById } from './api/handlers/userApiHandler';
import useUser from '../lib/useUser';
import {useAppContext} from '../components/appProvider';
import {ChangePasswordModal} from '../components/account/changePasswordModal';
import Studio from './studio';
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";

export default function Account(props) {
  const { user } = useUser();
  const [account, setAccount] = useState<AccountService>();
  const {
    store
  } = useAppContext();
  console.log(props);

  useEffect(() => {
    // @ts-ignore
    getUsersById(user?.id).then((users) => {
      if (users.length > 0) {
        setAccount(new AccountService(users[0]));
      }
    });
  }, [user]);


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
            {account?.Name}
          </div>
        </div>
        <div className={'info-row'}>
          <div className={'info-row__header'}>
            Handle
          </div>
          <div className={'info-row__value'}>
            {account?.Handle}
          </div>
        </div>
        <div className={'info-row'}>
          <div className={'info-row__header'}>
            Email
          </div>
          <div className={'info-row__value'}>
            {account?.Email}
          </div>
        </div>
        <div className={'info-row'}>
          <div style={{ fontWeight: 'bold', fontSize: '16pt', marginBottom: '10px' }}>Account Options</div>
          <div onClick={() => store.Modal.showModal(ChangePasswordModal, {})}>Change Password</div>


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

Account.requireAuth = true;