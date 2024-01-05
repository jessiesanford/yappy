import React, { useState } from 'react';
import { BaseModal } from '../modal/baseModal';
import { updatePassword } from "../../pages/api/handlers/userApiHandler";
import {hashPassword} from "../../util/baseUtils";

export const ChangePasswordModal = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const action = async () => {
    const res = await fetch('/api/user/getSalt', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const accountData = await res.json();

    const { salt, hash } = hashPassword(newPassword, accountData.salt);
    const updatePasswordRes = await updatePassword(salt, hash);
    if (updatePasswordRes.success) {
      return { success: true }
    } else {
      return { success: false }
    }
  };

  return (
    <BaseModal
      title={'Create Project'}
      action={action}
      actionLabel={'Create'}
    >
      <div className={'modal-content'}>
        <div className={'input-container'}>
          <input type={'password'}
                 value={currentPassword}
                 onChange={(e) => setCurrentPassword(e.target.value)}
                 style={{ minWidth: '300px' }}
                 placeholder={'Current Password'}
          />
        </div>
        <div className={'input-container'}>
          <input type={'password'}
                 value={newPassword}
                 onChange={(e) => setNewPassword(e.target.value)}
                 style={{ minWidth: '300px' }}
                 placeholder={'New password'}
          />
        </div>
        <div className={'input-container'}>
          <input type={'password'}
                 value={confirmNewPassword}
                 onChange={(e) => setConfirmNewPassword(e.target.value)}
                 style={{ minWidth: '300px' }}
                 placeholder={'Confirm new password'}
          />
        </div>
      </div>
    </BaseModal>
  );
};