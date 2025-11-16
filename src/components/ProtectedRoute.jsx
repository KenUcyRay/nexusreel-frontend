import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, loading } = useAuthContext();

    // CRITICAL: Wait for auth check to complete
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // CRITICAL: Only redirect if auth check is complete AND user is null
    if (!loading && !user) {
        return <Navigate to="/login" replace />;
    }

    // CRITICAL: Role check only if user exists
    if (user && roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;