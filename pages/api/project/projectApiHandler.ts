import { ProjectFeedUpdated } from '../../../static/events';

export const getProjects = async () => {
  const dev = process.env.NODE_ENV !== 'production';
  const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';

  const results = await fetch(`${server}/api/project/get`, {
    method: 'GET',
  });
  return await results.json();
}

export const deleteProject = async (id: number) => {
  await fetch('/api/project/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id
    }),
  });
  ProjectFeedUpdated();
};