import React, { useState } from "react";
import { useModalContext } from '../modal/modalProvider';
import { BaseModal } from '../modal/baseModal';
import words from 'random-words';
import { useRouter } from 'next/router';
import { ProjectFeedUpdated } from '../../static/events';

export const CreateProjectModal = () => {
  const router = useRouter();

  const {
    hideModal,
  } = useModalContext();

  const [name, setName] = useState(words({exactly: 3, join: ' '}));

  const action = () => {
    fetch('/api/project/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name
      }),
    }).then((res) => {
      if (res.ok) {
        ProjectFeedUpdated();
      }

    }).catch(() => {
    })
  }

  return (
    <BaseModal title={'Create Project'} action={action}>
      <div className={'modal-content'}>
        <div className={'input-container'}>
          <input type={'text'}
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 style={{ minWidth: '300px' }}
                 placeholder={'name'} />
        </div>
        <div className={'input-container'}>
          <select>
            <option>FPS</option>
            <option>RPG</option>
            <option>VR</option>
          </select>
        </div>
      </div>
    </BaseModal>
  );
};