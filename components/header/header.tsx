import styles from '../../styles/Navbar.module.css'
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { HeaderNavItem } from './headerNavItem';


export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  // gotta implement user menu
  const [userMenuHidden, setUserMenuHidden] = useState(true);

  const generateUserPanel = () => {
    return (
      <div className={'user-panel'}>
        <div className={'user-panel__avatar'}>
          <img src={''} />
        </div>
        <div className={'user-panel__handle'} onClick={() => setUserMenuHidden(!userMenuHidden)}>
          <div>{user?.name}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={'navbar'}>
      <div className={'navbar__content'}>
        <div className={'logo'}>NEPTUNE</div>
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

