

export default function Sidebar({ something } : any) {
  return (
    <div className={'sidebar'}>
      <div className={'sidebar-create'}>
        <button onClick={() => openCreateProjectModal()}>Create</button>
      </div>
      <div className={'nav'}>
        <NavItem name={'Projects'}>
          <NavItem name={'Home'}/>
          <NavItem name={'Archive'}/>
          <NavItem name={'Trash'}/>
        </NavItem>
        <NavItem name={'Settings'} />
        <NavItem name={'Team'} />
      </div>
    </div>
  )
}

export function NavItem(props: any) {
  const renderNavItemChildren = () => {
    const childrenItems = props.children.map((child : any) => {
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