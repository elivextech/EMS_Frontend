import api from './api';

// POST /email/send
// body: { templateId, to, subject, data }
export const sendEmail = async ({ templateId, to, subject, data }) => {
  try {
    const response = await api.post('/email/send', { templateId, to, subject, data });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET /email/logs  — fetch email logs
export const fetchEmailLogs = async () => {
  try {
    const response = await api.get('/email/logs');
    return response.data;
  } catch (error) {
    throw error;
  }
};
