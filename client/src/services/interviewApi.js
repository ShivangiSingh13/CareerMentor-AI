import api from './api';

export const startInterview = async (payload) => {
  const { data } = await api.post('/interview/start', payload);
  return data;
};

export const submitAnswer = async (id, payload) => {
  const { data } = await api.post(`/interview/${id}/answer`, payload);
  return data;
};

export const getInterviewById = async (id) => {
  const { data } = await api.get(`/interview/${id}`);
  return data;
};

export const listInterviews = async () => {
  const { data } = await api.get('/interview');
  return data;
};
