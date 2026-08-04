import api from './api';

export const uploadResume = async (formData) => {
  const { data } = await api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const getResumeById = async (id) => {
  const { data } = await api.get(`/resume/${id}`);
  return data;
};
