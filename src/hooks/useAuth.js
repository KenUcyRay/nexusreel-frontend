import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            
            const response = await api.get('/api/user');
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
            if (error.response?.status === 401) {
                setUser(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (credentials) => {
        const response = await api.post('/api/login', credentials);
        if (response.data.success) {
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/api/register', userData);
        if (response.data.success) {
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/api/logout');
        } finally {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    return { user, loading, login, register, logout, checkAuth };
};