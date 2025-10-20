import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const SimpleLogin = () => {
    const [email, setEmail] = useState('user@cinema.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login({ email, password });
            console.log('Login successful');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 border rounded">
            <h2 className="text-2xl mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default SimpleLogin;