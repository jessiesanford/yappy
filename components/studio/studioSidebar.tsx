import { CreateProjectModal } from './createProjectModal';
import { useModalContext } from '../modal/modalProvider';
import React from 'react';
import { useAppContext } from '../appProvider';
import { observer } from 'mobx-react-lite';
import { AppPages } from '../../util/enums';
import { useRouter } from 'next/router';
import { FiActivity, FiPackage, FiSettings, FiTrash, FiUsers } from 'react-icons/fi';
import { useSession } from 'next-auth/react';


export default function StudioSidebar() {
  const {
    store
  } = useAppContext();

  const { data: session } = useSession();
  const user = session?.user;

  const { showModal } = useModalContext();

  return (
    <div className={'sidebar'}>
      <div className={'sidebar-nav'}>
        <NavItem id={AppPages.PROJECTS} label={'Projects'} icon={<FiPackage/>} link={'/studio'} />
        <NavItem id={AppPages.TRASH} label={'Trash'} icon={<FiTrash/>} link={'/trash'} />
        <NavItem id={AppPages.SETTINGS} label={'Settings'} icon={<FiSettings/>} link={'/account'} />
        <NavItem id={AppPages.TEAM} label={'Team'} icon={<FiUsers/>} link={'/team'} />
      </div>
    </div>
  );
}

type TNavItem = {
  children?: React.ReactElement[],
  id: AppPages,
  label?: string,
  icon?: React.ReactElement,
  link?: string,
}

export const NavItem = observer(({ children, id, label, icon, link }: TNavItem) => {
  const {
    store
  } = useAppContext();

  const router = useRouter();
  const { asPath } = useRouter();

  const renderNavItemChildren = () => {
    const childrenItems = children?.map((child) => {
      return child;
    });
    return (
      <div className={'nav-item__children'}>
        {childrenItems}
      </div>
    );
  };

  const renderIcon = () => {
    if (icon) {
      return (
        <div className={'nav-item__icon'}>
          {icon}
          {/*<i className={icon}/>*/}
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`nav-item ${asPath === link ? 'active' : ''}`}
         onClick={() => {
           router.push(link);
         }}
    >
      {renderIcon()}
      <div>
        {label}
      </div>
      {children ? renderNavItemChildren() : null}
    </div>
  );
});


export function NavSubItem(props: any) {
  return (
    <div>

    </div>
  );
}