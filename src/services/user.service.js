import api from './api';

// POST /user/login
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/user/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST /user/logout
export const logoutUser = async () => {
  try {
    const response = await api.post('/user/logout');
    return response.data;
  } catch (error) {
    throw error;
  } finally {
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
  }
};

// POST /user/register
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/user/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PATCH /user/change-password
export const changePassword = async ({ oldPassword, newPassword, confirmPassword }) => {
  try {
    const response = await api.patch('/user/change-password', { oldPassword, newPassword, confirmPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET /user/
export const fetchAllUsers = async () => {
  try {
    const response = await api.get('/user/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE /user/:id
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PATCH /user/:id  — update name, email, role
export const updateUser = async (id, { name, email, role }) => {
  try {
    const response = await api.patch(`/user/${id}`, { name, email, role });
    return response.data;
  } catch (error) {
    throw error;
  }
};
