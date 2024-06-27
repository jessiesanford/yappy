import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { StudioLayout } from '../../components/layouts';
import { FiCheck, FiDatabase, FiEdit2, FiFileText, FiPackage, FiPieChart } from 'react-icons/fi';
import { ReactElement, useState } from 'react';
import { getProject, getProjects, updateProject } from '../api/handlers/projectApiHandler';
import { Project as ProjectItem } from '@prisma/client';
import { getSession } from "next-auth/react"; // ...as ProjectItem because of some Project namespace error when accessing this

type TProjectModuleGridProps = {
  children: JSX.Element[],
}

type TProjectModuleProps = {
  name: string,
  icon?: ReactElement,
  link?: string,
}

export default function Project({ project }: { project: ProjectItem }) {
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
    <StudioLayout title={project.name}>
      <div className={'project-view'}>
        <div className={'project-heading'}
             onMouseOver={() => setShowNameTools(true)}
             onMouseOut={() => setShowNameTools(false)}
        >
          <div className={'project-name'}>
            {editNameMode ?
              <input value={name}
                     style={{ width: '400px' }}
                     onChange={(e) => {
                       setName(e.target.value);
                     }}
                     autoFocus={true}
                     onClick={(e) => {
                       e.stopPropagation();
                     }}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter') {
                         updateProject(project.id, { name });
                         setEditNameMode(false);
                       }
                     }}
              /> :
              name}
          </div>
          {renderNameTools()}
        </div>
        <ProjectModuleGrid>
          <ProjectModule name={'Editor'}
                         icon={<FiFileText size={20}/>}
                         link={`/editor/${project.id}`}
          />
          <ProjectModule name={'Catalog'}
                         icon={<FiDatabase size={20}/>}
          />
          <ProjectModule name={'Reports'}
                         icon={<FiPieChart size={20}/>}
          />
          <ProjectModule name={'Assets'}
                         icon={<FiPackage size={20}/>}
          />
        </ProjectModuleGrid>
      </div>
    </StudioLayout>
  );
}

export function ProjectModuleGrid({ children }: TProjectModuleGridProps) {
  return (
    <div>
      <div className={'project-modules__container'}>
        {children}
      </div>
    </div>
  );
}

export function ProjectModule({ name, icon, link }: TProjectModuleProps) {
  const router = useRouter();

  const renderIcon = () => {
    if (icon) {
      return (
        <div className={'module__icon'}>
          {icon}
        </div>
      );
    }

    return null;
  };

  return (
    <div className={'module__container'} onClick={() => {
      if (link) {
        router.push(link);
      }
    }}>
      <div className={'module__block'}>
        <div className={'module__heading'}>
          {renderIcon()}
          <div>
            {name}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const query = context.query;
  const { projectId } = query;

  const dev = process.env.NODE_ENV !== 'production';
  const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';

  const results = await fetch(`${server}/api/project/${projectId}`, {
    method: 'GET',
  });
  const projects = await results.json();
  console.log(projects);

  return {
    props: {
      project: { name: 'test' }
    }
  };
};