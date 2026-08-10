import api from './api';

export const createJob = async (payload) => {
  const { data } = await api.post('/jobs', payload);
  return data;
};

export const updateJob = async (id, payload) => {
  const { data } = await api.patch(`/jobs/${id}`, payload);
  return data;
};

export const deleteJob = async (id) => {
  const { data } = await api.delete(`/jobs/${id}`);
  return data;
};

export const listJobs = async (params = {}) => {
  const { data } = await api.get('/jobs', { params });
  return data;
};

export const getJob = async (id) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
};

export const listMyPostedJobs = async () => {
  const { data } = await api.get('/jobs/recruiter/mine');
  return data;
};
