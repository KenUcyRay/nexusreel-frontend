const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  STORAGE_URL: import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Nexus Cinema',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0'
};

export default config;