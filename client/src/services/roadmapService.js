import api from './api';

export const generateRoadmap = async (payload) => {
  const { data } = await api.post('/roadmap/generate', payload);
  return data;
};

export const getRoadmapById = async (id) => {
  const { data } = await api.get(`/roadmap/${id}`);
  return data;
};
