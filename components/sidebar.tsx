import { CreateProjectModal } from './studio/createProjectModal';
import { useModalContext } from './modal/modalProvider';


export default function Sidebar() {
  const { showModal } = useModalContext();

  return (
    <div className={'sidebar'}>
      <div className={'sidebar-create'}>
        <button
          onClick={() => {
            showModal(CreateProjectModal)
          }
        }>Create</button>
      </div>
      <div className={'nav'}>
        <NavItem name={'Projects'}/>
        <NavItem name={'Trash'}/>
        <NavItem name={'Settings'} />
        <NavItem name={'Team'} />
      </div>
    </div>
  )
}

export function NavItem(props: any) {
  const renderNavItemChildren = () => {
    const childrenItems = props.children.map((child) => {
      return child;
    });
    return (
      <div className={'nav-item__children'}>
        {childrenItems}
      </div>
    )
  }

  return (
    <div className={'nav-item'}
         onClick={() => {}}
    >
      {props.name}
      {props.children ? renderNavItemChildren() : null}
    </div>
  )
}


export function NavSubItem(props: any) {
  return (
    <div>

    </div>
  )
}