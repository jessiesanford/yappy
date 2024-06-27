import { GetServerSidePropsContext } from 'next';
import { TProjectItem } from '../../types/projectTypes';
import { FiCheck, FiEdit2, } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import ModuleLayout from '../../components/layouts/moduleLayout';
import { ScriptEditor } from '../../components/editor/scriptEditor';

type TProjectProps = {
  project: TProjectItem
};

export default function EditorModule(props: TProjectProps) {
  const [showNameTools, setShowNameTools] = useState(false);
  const [editNameMode, setEditNameMode] = useState(false);
  const {
    project
  } = props;
  const [name, setName] = useState(project.name);

  useEffect(() => {
  }, []);

  const renderNameTools = () => {
    if (showNameTools) {
      return (
        <div className={''} style={{marginLeft: '20px'}}>
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
      );
    }

    return null;
  };

  return (
    <ModuleLayout title={project.name} moduleName={'Editor'}>
      <div className={'project-view'}>
        <div className={'project-heading'}
             onMouseOver={() => setShowNameTools(true)}
             onMouseOut={() => setShowNameTools(false)}
        >
          {renderNameTools()}
        </div>
      </div>
      <ScriptEditor/>
    </ModuleLayout>
  );
}


export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const query = context.query;

  const dev = process.env.NODE_ENV !== 'production';
  const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';

  const results = await fetch(`${server}/api/project/${query.projectId}`, {
    method: 'GET',
  });
  const project = await results.json();

  return {
    props: {
      project,
    }
  };
};