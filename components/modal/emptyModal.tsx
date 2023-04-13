import React, { useState } from 'react';
import { useModalContext } from './modalProvider';
import { BaseModal } from './baseModal';
import words from 'random-words';
import { useRouter } from 'next/router';

export const EmptyModal = () => {
  const router = useRouter();

  const {
    hideModal,
  } = useModalContext();

  const [name, setName] = useState(words({exactly: 3, join: ' '}));

  return (
    <BaseModal title={'Empty'}>
    </BaseModal>
  );
};