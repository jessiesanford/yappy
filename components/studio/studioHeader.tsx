import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { HeaderNavItem } from '../header/headerNavItem';
import { FiActivity } from 'react-icons/fi';

type DropdownItemProps = {
  label: string,
  onClick?: () => void,
}

export function StudioHeader() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  // gotta implement user menu
  const [userMenuHidden, setUserMenuHidden] = useState(true);

  const generateUserPanel = () => {
    return (
      <div className={'user-panel'}>
        <div className={'user-panel__avatar'}>
          <img src={''} />
        </div>
        <div className={'user-panel__handle'}
             onClick={() => setUserMenuHidden(!userMenuHidden)}>
          <div>{user?.name}</div>
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
                              console.log(e);
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
      <HeaderNavItem name={'Account'} link={'/account'} />
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

