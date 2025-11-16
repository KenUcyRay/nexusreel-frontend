import api from '../utils/api';

export const scheduleService = {
  getSchedules: () => api.get('/api/schedules'),
  createSchedule: (data) => api.post('/api/admin/schedules', data),
  getSchedule: (id) => api.get(`/api/schedules/${id}`),
  updateSchedule: (id, data) => api.put(`/api/admin/schedules/${id}`, data),
  deleteSchedule: (id) => api.delete(`/api/admin/schedules/${id}`),
  getSchedulesByMovie: (movieId) => api.get(`/api/schedules/movie/${movieId}`)
};

export default scheduleService;