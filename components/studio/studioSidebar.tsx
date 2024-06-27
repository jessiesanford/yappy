import { useModalContext } from '../modal/modalProvider';
import React from 'react';
import { useAppContext } from '../appProvider';
import { observer } from 'mobx-react-lite';
import { AppPages } from '../../static/enums';
import { useRouter } from 'next/router';
import { FiPackage, FiSettings, FiTrash, FiUsers } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { ProjectFilters } from "../../store/";


export const StudioSidebar = observer((props) => {
  const {
    store
  } = useAppContext();

  const router = useRouter();
  const { asPath } = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className={'studio-sidebar'}>
      <div className={'studio-sidebar__nav'}>
        <NavItem id={AppPages.PROJECTS}
                 label={'Projects'}
                 icon={<FiPackage/>}
                 link={'/studio'}
                 isActive={asPath === '/studio'}
        >
          <NavItem id={'all'}
                   label={'All'}
                   onClick={() => {
                     store.Studio.setProjectFilter(ProjectFilters.ALL);
                   }}
                   isActive={store.Studio.projectFilter === ProjectFilters.ALL}
          />
          <NavItem id={'trash'}
                   label={'Trash'}
                   onClick={() => {
                     store.Studio.setProjectFilter(ProjectFilters.TRASHED);
                   }}
                   isActive={store.Studio.projectFilter === ProjectFilters.TRASHED}
          />
        </NavItem>
        <NavItem id={AppPages.SETTINGS} label={'Settings'} icon={<FiSettings/>} link={'/account'}/>
        <NavItem id={AppPages.TEAM} label={'Team'} icon={<FiUsers/>} link={'/team'}/>
      </div>
    </div>
  );
});

type TNavItem = {
  children?: React.ReactElement[],
  id: AppPages | string
  label?: string,
  icon?: React.ReactElement,
  link?: string,
  onClick?: () => void,
  isActive?: boolean,
}

export const NavItem = observer(({ children, id, label, icon, link, onClick, isActive }: TNavItem) => {
  const {
    store
  } = useAppContext();

  const router = useRouter();
  const { asPath } = useRouter();

  const renderNavItemChildren = () => {
    if (isActive) {
      return (
        <div className={'nav-item__children'}>
          {children}
        </div>
      );
    }
    return null;
  };

  const renderIcon = () => {
    if (icon) {
      return (
        <div className={'nav-item__icon'}>
          {icon}
        </div>
      );
    }

    return null;
  };

  const handleClick = () => {
    if (link) {
      router.push(link);
    } else if (onClick) {
      onClick();
    }
  }
  return (
    <div className={`nav-item ${isActive ? 'active' : ''}`}
    >
      <div className={'nav-item__header'}
           onClick={() => {handleClick()}}
      >
        {renderIcon()}
        <div className={'nav-item__label'}>
          {label}
        </div>
      </div>

      {children ? renderNavItemChildren() : null}
    </div>
  );
});