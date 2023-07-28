import React, { useState } from 'react';
import { useModalContext } from '../modal/modalProvider';
import { BaseModal } from '../modal/baseModal';
import words from 'random-words';
import { useRouter } from 'next/router';
import { ProjectFeedUpdated } from '../../static/events';
import { createProject } from '../../pages/api/project/projectApiHandler';
import { useSession } from 'next-auth/react';
import { capitalizeEachWord } from "../../util/baseUtils";

export const CreateProjectModal = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [name, setName] = useState(capitalizeEachWord(words({exactly: 3, join: ' '})));

  const action = () => {
    createProject(name, user.id).then((res) => {
      ProjectFeedUpdated();
    });
  };

  return (
    <BaseModal
      title={'Create Project'}
      action={action}
      actionLabel={'Create'}
    >
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