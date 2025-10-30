import api from '../utils/api';

export const studioService = {
  // Get all studios
  getStudios: () => api.get('/api/studios'),
  
  // Create new studio
  createStudio: (data) => api.post('/api/studios', data),
  
  // Get studio by ID
  getStudio: (id) => api.get(`/api/studios/${id}`),
  
  // Update studio
  updateStudio: (id, data) => api.put(`/api/studios/${id}`, data),
  
  // Delete studio
  deleteStudio: (id) => api.delete(`/api/studios/${id}`)
};

export default studioService;