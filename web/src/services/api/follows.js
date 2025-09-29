import { baseUrl, fetchWrapper } from './config';

export const searchUsers = async (query) => {
  if (!query) return [];
  return await fetchWrapper(`${baseUrl}profiles/search?q=${query}`, {
    credentials: 'include',
  });
};

export const followUser = async (userId) => {
  return await fetchWrapper(`${baseUrl}follows/${userId}`, {
    method: 'POST',
    credentials: 'include',
  });
};

export const unfollowUser = async (userId) => {
  return await fetchWrapper(`${baseUrl}follows/${userId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
};

export const getUserStats = async (userId) => {
  return await fetchWrapper(`${baseUrl}profiles/${userId}/stats`, {
    credentials: 'include',
  });
};
