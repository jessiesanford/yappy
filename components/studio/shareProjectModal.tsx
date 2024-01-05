import { BaseModal } from '../modal/baseModal';
import React, { useEffect, useRef, useState } from 'react';
import { getProjects, shareProject } from '../../pages/api/handlers/projectApiHandler';
import { useAppContext } from '../appProvider';
import { FiCrosshair, FiDelete, FiPlus, FiTrash, FiX } from 'react-icons/fi';
import { getProjectShares } from '../../pages/api/handlers/projectApiHandler';
import { getUserByEmail, getUsersByIds } from '../../pages/api/handlers/userApiHandler';

export const ShareProjectModal = (props) => {
  const {
    store
  } = useAppContext();

  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);
  const emailInputRef = useRef();

  useEffect(() => {
    getProjectShares(props.projectId).then(async (shares) => {
      const userIds = shares.filter((share) => share.userId).reduce((result, obj) => {
        result.push(obj.userId);
        return result;
      }, []);
      const emails = shares.filter((share) => share.email);
      const users = await getUsersByIds(userIds);
      const userEmails = users.reduce((result, obj) => {
        result.push(obj.email);
        return result;
      }, []);
      setEmails(emails.concat(userEmails));
    });
  }, []);

  const handleInputChange = (e: InputEvent) => {
    setEmail(e.target.value);
  };

  const handleInputKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      handleAddEmail();
    }
  };

  const handleAddEmail = () => {
    const formattedEmail = email.trim().toLowerCase();
    if (!validateEmail(formattedEmail)) {
      // store.Modal.setError({ msg: 'Invalid email address.', hidden: false });
      setError('Invalid email address.');
      return;
    } else if (formattedEmail.trim() !== '') {
      if (!emails.includes(formattedEmail)) {
        setEmails([...emails, formattedEmail]);
      }
      setEmail('');
      setError(null);
    }
  };

  const handleRemoveEmail = (index) => {
    const updatedList = emails.filter((_, i) => i !== index);
    setEmails(updatedList);
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const action = async () => {
    if (email) {
      handleAddEmail();
    }
    const res = await shareProject(props.projectId, emails);
    return { success: !!res.success };
  };

  return (
    <BaseModal
      title={'Share Project'}
      action={action}
      actionLabel={'Share'}
    >
      <div className={'modal-content'}>
        <div className={'email-share-container'} onClick={() => emailInputRef.current.focus()}>
          <div className={'email-input-container'}>
            <input
              type="text"
              value={email}
              onChange={handleInputChange}
              onKeyDown={handleInputKeydown}
              placeholder="Enter email"
              ref={emailInputRef}
            />
          </div>
          {error ? <div className="error" style={{ padding: '5px', color: '#fc5e5e' }}>{error}</div> : null}
          <div className="email-list">
            {emails.map((email, index) => (
              <div key={index} className="email-list-item">
                <div>{email}</div>
                <div className={'remove-email-button'} onClick={() => handleRemoveEmail(index)}>
                  <FiX/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};