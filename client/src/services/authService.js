import api from './api';

export const authSignup = async (payload) => {
  const { data } = await api.post('/auth/signup', payload);
  return data;
};

export const authLogin = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};
