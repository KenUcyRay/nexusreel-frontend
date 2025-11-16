import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if we're on login/register pages - skip auth check to prevent auto-login
      const isAuthPage = window.location.pathname.includes('/login') || 
                        window.location.pathname.includes('/register');
      
      if (isAuthPage) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        const response = await api.get('/api/user');
        
        // Validate response has required user data
        if (response.data && response.data.email && response.data.role) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        
        // Clear any stale storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      // Get CSRF cookie first
      await api.get('/sanctum/csrf-cookie');
      
      const response = await api.post('/api/login', {
        login: credentials.email || credentials.phone,
        password: credentials.password,
        remember: credentials.remember || false
      });
      
      const { user } = response.data;
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint (ignore errors to prevent blocking)
      await api.post('/api/logout');
    } catch (error) {
      // Continue with logout even if API fails
    } finally {
      // CRITICAL: Always clear state regardless of API response
      setUser(null);
      
      // Clear any localStorage/sessionStorage if used
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      sessionStorage.clear();
    }
  };

  const register = async (userData) => {
    try {
      // Get CSRF cookie first
      await api.get('/sanctum/csrf-cookie');
      
      const response = await api.post('/api/register', userData);
      const { user } = response.data;
      
      if (user) {
        setUser(user);
      }
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };
};