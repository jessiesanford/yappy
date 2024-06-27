import { User } from '@prisma/client';

const dev = process.env.NODE_ENV !== 'production';
const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';

export const isHandleUnique = async (handle: string) => {
  const res = await fetch(`/api/user/handle/${handle}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  return json.handle === null;
};

export const isEmailUnique = async (email: string) => {
  const res = await fetch(`/api/user/email/${email}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  return json.email === null;
};

export const findUsersByEmail = async (searchText: string) => {
  const res = await fetch(`${server}/api/user/find/${searchText}`, {
    method: 'GET',
  });
  return await res.json();
};

export const getUserByEmail = async (email: string): Promise<User> => {
  const res = await fetch(`${server}/api/user/getByEmail/${email}`, {
    method: 'GET',
  });
  return await res.json();
}

export const getUsersById = async (id: string) => {
  const res = await fetch(`${server}/api/user/getById/${id}`, {
    method: 'GET',
  });
  return await res.json();
};

export const getUsersByIds = async (ids: string[]) => {
  const res = await fetch(`/api/user/getByIds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userIds: ids
    }),
  });
  return await res.json();
}

export const updatePassword = async (salt: string, hash: string) => {
  const res = await fetch(`/api/user/updatePassword`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hash,
      salt,
    }),
  });
  return await res.json();
}

