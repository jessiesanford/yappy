import { useProjectFeedContext } from '../../pages/studio';
import { useAppContext } from '../appProvider';
import { useEffect, useRef, useState } from 'react';
import { FiMoreVertical, FiShare, FiTrash } from 'react-icons/fi';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';

export function ProjectItem(props: any) {
  return <ProjectItem_ {...props}/>;
}

export const ProjectItem_ = observer(({ data }: { data: any }) => {
  const {
    deleteProject,
    // selectedProjectItems,
    // handleProjectItemSelection,
  } = useProjectFeedContext();

  const router = useRouter();

  const {
    store
  } = useAppContext();

  const {
    selectedProjectItems,
    toggleProjectItemSelected
  } = store.Studio;

  const ctxAnchorRef = useRef(null);
  const projectItemRef = useRef(null);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (projectItemRef.current && deleted) {
      projectItemRef.current.style.height = '0px';
    }
  }, [deleted]);

  const ctxMenuOpts = [
    {
      id: 'delete',
      label: 'Delete',
      icon: <FiTrash/>,
      onClick: () => {
        setDeleted(true);
        deleteProject(data.id);
        store.ContextMenu.setHidden(true);
      },
    },
    {
      id: 'share',
      label: 'Share',
      icon: <FiShare/>,
      onClick: () => {

      },
    }
  ];

  return (
    <div className={'project-item'} ref={projectItemRef}>
      <div className={'project-item__ctx-anchor'}
           ref={ctxAnchorRef}
           onClick={(e) => {
             const ctxSetupProps = {
               id: 'projectItemContext',
               options: ctxMenuOpts,
               hidden: false,
               target: ctxAnchorRef.current,
             };
             store.ContextMenu.setup(ctxSetupProps);
           }}>
        <FiMoreVertical />
      </div>
      <div className={`project-item__select ${selectedProjectItems.includes(data.id) ? 'selected' : null}`}
           onClick={() => toggleProjectItemSelected(data.id)}>
        <input type={'checkbox'}
               checked={selectedProjectItems.includes(data.id)}
               onChange={() => {}}
        />
      </div>
      <div className={'project-item__content'}>
        <div className={'project-item__img-container'}>
          <div className={'project-item__img'}>
            <img src={data.img}/>
          </div>
        </div>
        <div className={'project-item__info'}>
          <div className={'project-item__name'}
               onClick={() => {
                 router.push(`/project/${data.id}`);
               }}>
            {data.name}
          </div>
          <div className={'project-item__desc'}>
            {data.desc}
          </div>
        </div>
      </div>
    </div>
  );
});