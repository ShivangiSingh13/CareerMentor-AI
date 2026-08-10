import api from './api';

export const getSkillAnalytics = async () => {
  const { data } = await api.get('/analytics/skills');
  return data;
};

export default { getSkillAnalytics };
