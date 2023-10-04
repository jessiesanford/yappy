import { GetServerSidePropsContext } from 'next';
import { StudioLayout } from '../../components/layouts';
import { TProjectItem } from '../../types/projectTypes';
import { FiCheck, FiDatabase, FiEdit, FiEdit2, FiFileText, FiPackage, FiPieChart } from 'react-icons/fi';
import { ReactElement, useState } from 'react';
import { updateProject } from '../api/project/projectApiHandler';
import ModuleLayout from "../../components/layouts/moduleLayout";
import { ScriptEditor } from './scriptEditor';

type TProjectProps = {
  project: TProjectItem
};

export default function Project({ project }: TProjectProps) {
  const [showNameTools, setShowNameTools] = useState(false);
  const [editNameMode, setEditNameMode] = useState(false);
  const [name, setName] = useState(project.name);

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