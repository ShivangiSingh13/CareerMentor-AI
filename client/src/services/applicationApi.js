import api from './api';

export const applyToJob = async (payload) => {
  const { data } = await api.post('/applications', payload);
  return data;
};

export const listMyApplications = async () => {
  const { data } = await api.get('/applications/mine');
  return data;
};

export const listApplicantsForJob = async (jobId) => {
  const { data } = await api.get(`/applications/job/${jobId}`);
  return data;
};

export const updateApplicationStatus = async (id, status) => {
  const { data } = await api.patch(`/applications/${id}/status`, { status });
  return data;
};
