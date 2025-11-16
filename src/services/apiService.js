const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getTransactions() {
    return this.request('/transactions');
  }

  async createSampleTransactions() {
    return this.request('/test/create-sample-transactions', {
      method: 'POST'
    });
  }

  async getDashboardData(role, type = null) {
    const endpoint = `/dashboard/${role}${type ? `?type=${type}` : ''}`;
    return this.request(endpoint);
  }
}

export default new ApiService();