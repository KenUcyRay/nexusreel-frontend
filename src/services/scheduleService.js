import api from '../utils/api';

export const scheduleService = {
  getSchedules: () => api.get('/admin/schedules'),
  createSchedule: (data) => api.post('/admin/schedules', data),
  getSchedule: (id) => api.get(`/admin/schedules/${id}`),
  updateSchedule: (id, data) => api.put(`/admin/schedules/${id}`, data),
  deleteSchedule: (id) => api.delete(`/admin/schedules/${id}`),
  getSchedulesByMovie: (movieId) => api.get(`/schedules/movie/${movieId}`)
};

export default scheduleService;