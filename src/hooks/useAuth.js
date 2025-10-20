import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            
            const response = await api.get('/api/user');
            setUser(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                setUser(null);
                localStorage.removeItem('auth_token');
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
        setUser(response.data.user);
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
        }
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/api/register', userData);
        setUser(response.data.user);
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
        }
        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/api/logout');
        } finally {
            setUser(null);
            localStorage.removeItem('auth_token');
        }
    };

    return { user, loading, login, register, logout, checkAuth };
};