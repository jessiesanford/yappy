import { useAppContext } from '../appProvider';
import { useEffect, useRef, useState } from 'react';
import { FiCheck, FiEdit, FiEdit2, FiMoreVertical, FiShare, FiTrash } from 'react-icons/fi';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { convertDateFormat, stringToColor } from '../../util/baseUtils';
import { trashProject, updateProject } from '../../pages/api/handlers/projectApiHandler';
import { ShareProjectModal } from '../studio/shareProjectModal';
import { Project } from "@prisma/client";

export const ProjectItem = observer(({ data }: { data: Project }) => {
  const router = useRouter();
  const [editNameMode, setEditNameMode] = useState(false);
  const [toolsHidden, setToolsHidden] = useState(true);
  const [name, setName] = useState(data.name);

  const {
    store
  } = useAppContext();

  const {
    selectedProjectItems,
    toggleProjectItemSelected
  } = store.Studio;

  const ctxAnchorRef = useRef<HTMLDivElement>(null);
  const projectItemRef = useRef<HTMLDivElement>(null);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (projectItemRef.current && deleted) {
      projectItemRef.current.style.height = '0px';
    }
  }, [deleted]);

  const ctxMenuOpts = [
    {
      id: 'share',
      label: 'Share',
      icon: <FiShare/>,
      onClick: () => {
        store.Modal.showModal(ShareProjectModal, { projectId: data.id });
        store.ContextMenu.setHidden(true);
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <FiTrash/>,
      onClick: () => {
        trashProject(data.id).then(() => {
          setDeleted(true);
        });
        store.ContextMenu.setHidden(true);
      },
    },
  ];
  
  return (
    <div className={'project-item'}
         ref={projectItemRef}
         onMouseEnter={() => setToolsHidden(false)}
         onMouseLeave={() => setToolsHidden(true)}
    >
      <div className={'project-item__ctx-anchor'}
           ref={ctxAnchorRef}
           onClick={(e) => {
             if (ctxAnchorRef.current) {
               const ctxSetupProps = {
                 id: 'projectItemContext',
                 options: ctxMenuOpts,
                 hidden: false,
                 target: ctxAnchorRef.current,
               };
               store.ContextMenu.setup(ctxSetupProps);
             }
           }}>
        <FiMoreVertical/>
      </div>
      <div className={`project-item__select ${selectedProjectItems.includes(data.id) ? 'selected' : null}`}
           onClick={() => toggleProjectItemSelected(data.id)}>
        <div>
          <input type={'checkbox'}
                 checked={selectedProjectItems.includes(data.id)}
                 onChange={() => {
                 }}
          />
        </div>
      </div>
      <div className={'project-item__content'}>
        <div className={'project-item__img-container'} style={{ backgroundColor: stringToColor(data.name) }}>
          <div className={'project-item__img'}>
          </div>
        </div>
        <div className={'project-item__info'}>
          <div className={'project-item__name'}
               onClick={() => {
                 router.push(`/project/${data.id}`);
               }}>
            <div style={{ marginRight: '10px' }}>
              {editNameMode ?
                <input value={name}
                       onChange={(e) => {
                         setName(e.target.value);
                       }}
                       autoFocus={true}
                       onClick={(e) => {
                         e.stopPropagation();
                       }}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter') {
                           updateProject(data.id, { name });
                           setEditNameMode(false);
                         }
                       }}
                /> :
                data.name}
            </div>
            <div style={{ display: toolsHidden ? 'none' : 'initial' }}>
              {!editNameMode ?
                <div onClick={(e) => {
                  e.stopPropagation();
                  setEditNameMode(true);
                }} className={'edit-anchor'}>
                  <FiEdit2/>
                </div> :
                <div onClick={(e) => {
                  e.stopPropagation();
                  setEditNameMode(false);
                }} className={'edit-anchor'}>
                  <FiCheck/>
                </div>
              }
            </div>

          </div>
          <div className={'project-item__desc'}>
            {data.description}
          </div>
          <div className={'project-item__updated-at'}>
            Last modified on {convertDateFormat(data.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
});

export const GhostProjectItem = () => {
  return (
    <div className={'project-item'}>
      <div className={'project-item__select'}>
      </div>
      <div className={'project-item__content project-item__ghost-content'}>
        <div className={'project-item__img-container'} style={{backgroundColor: '#e0e0e0'}}>
          <div className={'project-item__img'}>
          </div>
        </div>
        <div className={'project-item__info'}>
          <div className={'project-item__ghost-name'}/>
          <div className={'project-item__ghost-desc'}/>
          <div className={'project-item__ghost-desc'}/>
        </div>
      </div>
    </div>
  );
};