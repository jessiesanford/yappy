import { useProjectFeedContext } from '../../pages/studio';

export function ProjectItem(props: any) {
  const {
    deleteProject,
  } = useProjectFeedContext();

  return (
    <div className={'project-item'}>
      <div className={'project-item__img-container'}>
        <div className={'project-item__ctx-anchor'} onClick={() => deleteProject(props.data.id)}>
          <i className="fa fa-close"></i>
        </div>
        <div className={'project-item__img'}>
          <img src={props.data.img}/>
        </div>
      </div>
      <div className={'project-item__info'}>
        <div className={'project-item__name'}>
          {props.data.name}
        </div>
        <div className={'project-item__desc'}>
          {props.data.desc}
        </div>
      </div>
    </div>
  )
}