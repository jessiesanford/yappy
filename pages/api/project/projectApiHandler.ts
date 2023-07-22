import { ProjectFeedUpdated } from '../../../static/events';

const dev = process.env.NODE_ENV !== 'production';
const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';

// write an api call to create a project
export const createProject = async (name: string, createdBy: string) => {
  await fetch('/api/project/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      createdBy,
    }),
  }).catch((e) => {
    console.log(e);
  });
}

export const getProjects = async () => {
  const results = await fetch(`${server}/api/project/get`, {
    method: 'GET',
  });
  return await results.json();
}

export const deleteProject = async (id: string) => {
  await fetch('/api/project/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id
    }),
  });
  ProjectFeedUpdated();
};

export const deleteProjects = async (ids: string[]) => {
  await fetch('/api/project/deleteMany', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ids
    }),
  });
  ProjectFeedUpdated();
};

export const trashProject = async (id: number) => {
  await fetch('/api/project/trash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id
    }),
  });
  ProjectFeedUpdated();
}

// write an api call to update a project
export const updateProject = async (id: number, name: string, description: string, status: string, startDate: string, endDate: string, priority: string, projectManager: string, team: string) => {
  await fetch('/api/project/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      name,
      description,
      status,
      startDate,
      endDate,
      priority,
      projectManager,
      team
    }),
  });
  ProjectFeedUpdated();
}