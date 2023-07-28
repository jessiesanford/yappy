import { BaseModal } from '../modal/baseModal';
import React, { useRef, useState } from 'react';
import { shareProject } from '../../pages/api/project/projectApiHandler';
import { useAppContext } from '../appProvider';
import { FiCrosshair, FiDelete, FiPlus, FiTrash, FiX } from 'react-icons/fi';

export const ShareProjectModal = (props) => {
  const {
    store
  } = useAppContext();

  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);
  const emailInputRef = useRef();

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
    let formattedEmail = email.trim().toLowerCase();
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

  const action = () => {
    if (email) {
      handleAddEmail();
    }
    shareProject(props.projectId, emails);
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