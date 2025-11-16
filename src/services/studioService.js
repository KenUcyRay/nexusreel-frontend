import api from '../utils/api';

export const studioService = {
  // Get all studios
  getStudios: () => api.get('/api/studios'),
  
  // Create new studio
  createStudio: (data) => api.post('/api/admin/studios', data),
  
  // Get studio by ID
  getStudio: (id) => api.get(`/api/studios/${id}`),
  
  // Update studio
  updateStudio: (id, data) => api.put(`/api/admin/studios/${id}`, data),
  
  // Delete studio
  deleteStudio: (id) => api.delete(`/api/admin/studios/${id}`)
};

export default studioService;