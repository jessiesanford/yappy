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