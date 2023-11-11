import { ProjectFeedUpdated } from '../../../static/events';
import { findUsersByEmail, getUserByEmail } from '../user/userApiHandler';
import {buildQuery} from "../../../util/baseUtils";

const dev = process.env.NODE_ENV !== 'production';
const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';

// write an api call to create a project
export const createProject = async (name: string, userId: string) => {
  await fetch('/api/project/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      createdBy: userId,
      updatedBy: userId,
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

export const getProjectsForUser = async (userId: number) => {
  const results = await fetch(`${server}/api/project/getForUser/${userId}`, {
    method: 'GET'
  });
};

export const searchUserProjects = async (queryString: string, limit?: number) => {
  const query = buildQuery(`${server}/api/project/search`, {
    text: queryString,
    limit,
  })
  const results = await fetch(query, { method: 'GET' });
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
};

export const trashProjects = async (ids: string[]) => {
  await fetch('/api/project/trashMany', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ids
    }),
  });
  ProjectFeedUpdated();
};

export const restoreProjects = async(ids: string[]) => {
  await fetch('/api/project/restoreMany', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ids
    }),
  });
  ProjectFeedUpdated();
}

export const shareProject = async (projectId: string, emails: string[]) => {
  const users = {};

  for (const email of emails) {
    const user = await getUserByEmail(email);
    if (user) {
      users[email] = user;
    }
  }

  await fetch('/api/project/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId,
      emails,
      users,
    }),
  });
};

export const getProjectShares = async (projectId: string) => {
  const results = await fetch(`${server}/api/project/getShares/${projectId}`, {
    method: 'GET'
  });
  return await results.json();
};

// write an api call to update a project
export const updateProject = async (id: number, data: any = {}) => {
  await fetch('/api/project/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      data
    }),
  });
  ProjectFeedUpdated();
};

export const deleteProjectSharesByProjectId = async (projectId: string) => {
  await fetch('/api/projectShare/deleteMany', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId
    }),
  });
}