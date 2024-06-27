import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { HeaderNavItem } from './headerNavItem';
import { FiActivity } from 'react-icons/fi';
import useUser from "../../lib/useUser";

type DropdownItemProps = {
  label: string,
  onClick?: () => void,
}

const generateIntials = (name: string) => {
  // Split the name into words
  const words = name.split(' ');

  // Initialize an empty string to store the initials
  let initials = '';

  // Loop through the words and extract the first character of each word
  for (let i = 0; i < words.length && initials.length < 2; i++) {
    initials += words[i][0];
  }

  return initials;
}

export function StudioHeader() {
  const { user } = useUser();
  const router = useRouter();

  // gotta implement user menu
  const [userMenuHidden, setUserMenuHidden] = useState(true);

  const generateUserPanel = () => {
    return (
      <div className={'user-panel'}>
        <div className={'user-panel__avatar'} onClick={() => setUserMenuHidden(!userMenuHidden)}>
          <div className={'avatar__initials'}>
            {generateIntials(user?.name || 'Unknown User')}
          </div>
        </div>
        <div className={'user-panel__handle'}
             onClick={() => setUserMenuHidden(!userMenuHidden)}>
          <div className={`user-panel__dropdown ${userMenuHidden ? 'hidden' : null}`}>
            <DropdownItem label={'Settings'}
                          onClick={() => {
                            router.push('/account')
                          }} />
            <DropdownItem label={'Logout'}
                          onClick={() => {
                            signOut().then(() => {
                              router.push('/studio');
                            }).catch((e) => {
                              throw new Error(e);
                            });
                          }}/>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={'navbar'}>
      <div className={'navbar__content'}>
        <div className={'logo'}>
          <div style={{display: 'flex', marginRight: '10px'}}><FiActivity/></div>
          <div>NEPTUNE</div>
        </div>
        <div className={'push'}></div>
        <HeaderNavigation />
        {generateUserPanel()}
      </div>
    </div>
  );
}

export const HeaderNavigation = () => {
  return (
    <div className={'header-nav'}>
      <HeaderNavItem name={'Studio'} link={'/studio'} />
    </div>
  );
};

const DropdownItem = ({ label, onClick }: DropdownItemProps) => {
  return (
    <div className={'dropdown-item'} onClick={onClick}>
      <div>
        {label}
      </div>
    </div>
  );
};

