import { fetcher } from '../lib/http';

export const changeUserStatus = async (userId, newStatus) => {
  return await fetcher(`auth/update-client-status/${userId}`, {
    method: 'POST',
    body: { newStatus },
  });
};

export const getUsers = async () => {
  return await fetcher(`auth/users`);
};
