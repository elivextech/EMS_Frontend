import api from './api';

// GET /contact/
export const fetchContacts = async () => {
  try {
    const response = await api.get('/contact/');
    return response.data;
  } catch (error) {
    throw error;
  }
};
