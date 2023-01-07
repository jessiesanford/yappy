import BaseLayout from "../components/layouts/baseLayout";
import StudioLayout from "../components/layouts/studioLayout";
import {ProjectFeedMock} from "../static/projectMocks";

export default function Studio() {
  const renderProjectFeed = ((projectFeed: Array<any>) => {
    return projectFeed.map((projectItem) => {
      return <ProjectItem key={projectItem.id} data={projectItem}/>
    })
  });

  return (
    <StudioLayout>
      <div className={'project-list'}>
        {renderProjectFeed(ProjectFeedMock)}
      </div>
    </StudioLayout>
  )
}

export function ProjectItem(props: any) {
  return (
    <div className={'project-item'}>
      <div className={'project-item__img-container'}>
        <div className={'project-item__ctx-anchor'}>
          <i className="fa-solid fa-user"></i>
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
