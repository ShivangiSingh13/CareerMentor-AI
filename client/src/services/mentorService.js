import api from './api';

export const getMentorHistory = async () => {
  const { data } = await api.get('/mentor/history');
  return data;
};

export const sendMentorMessage = async (message) => {
  const { data } = await api.post('/mentor/chat', { message });
  return data;
};
