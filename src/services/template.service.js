import api from './api';

// GET /templates/
export const fetchAllTemplates = async () => {
  try {
    const response = await api.get('/templates/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET /templates/:id
export const fetchTemplateById = async (id) => {
  try {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST /templates/upload  (multipart/form-data)
// fields: name, subject, category, htmlFile (File object)
export const uploadTemplate = async ({ name, subject, category, htmlFile }) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('subject', subject);
    formData.append('category', category);
    formData.append('htmlFile', htmlFile);

    const response = await api.post('/templates/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PATCH /templates/:id
export const updateTemplate = async (id, templateData) => {
  try {
    const response = await api.patch(`/templates/${id}`, templateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE /templates/:id
export const deleteTemplate = async (id) => {
  try {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
