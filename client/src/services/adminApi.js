import api from './api';

export const seedDemo = async () => {
  const res = await api.post('/admin/seed');
  return res.data;
};

export const listUsers = async () => {
  const res = await api.get('/admin/users');
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await api.patch(`/admin/users/${id}/role`, { role });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

export const getStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};
