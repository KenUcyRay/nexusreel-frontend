import React, { useState } from 'react';
import axios from 'axios';

const SimpleFixedLogin = () => {
    const [email, setEmail] = useState('user@cinema.com');
    const [password, setPassword] = useState('password');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            // Create axios instance with proper config
            const api = axios.create({
                baseURL: 'http://localhost:8000',
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('🔄 Getting CSRF cookie...');
            
            // Get CSRF cookie first
            await api.get('/sanctum/csrf-cookie');
            
            console.log('🔄 Attempting login...');
            
            // Login request
            const response = await api.post('/api/login', {
                email,
                password
            });

            console.log('✅ Login successful:', response.data);
            
            setResult({
                status: 'success',
                message: 'Login berhasil!',
                data: response.data
            });

            // Test user endpoint
            setTimeout(async () => {
                try {
                    const userResponse = await api.get('/api/user');
                    console.log('✅ User data:', userResponse.data);
                    setResult(prev => ({
                        ...prev,
                        userData: userResponse.data
                    }));
                } catch (error) {
                    console.error('❌ User request failed:', error);
                }
            }, 1000);

        } catch (error) {
            console.error('❌ Login failed:', error);
            setResult({
                status: 'error',
                message: error.response?.data?.message || error.message,
                error: error.response?.status
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">🔐 Simple Fixed Login</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
                >
                    {loading ? '🔄 Logging in...' : '🚀 Login'}
                </button>
            </form>

            {result && (
                <div className={`mt-6 p-4 rounded-lg ${
                    result.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                    <h3 className="font-bold mb-2">
                        {result.status === 'success' ? '✅ Success!' : '❌ Failed!'}
                    </h3>
                    <p className="text-sm mb-2">{result.message}</p>
                    
                    {result.data && (
                        <div className="mt-3">
                            <strong>Response:</strong>
                            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto">
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </div>
                    )}

                    {result.userData && (
                        <div className="mt-3">
                            <strong>User Data:</strong>
                            <pre className="bg-blue-100 p-2 rounded mt-1 text-xs overflow-auto">
                                {JSON.stringify(result.userData, null, 2)}
                            </pre>
                        </div>
                    )}
                    
                    {result.error && (
                        <div className="mt-3">
                            <strong>Error Code:</strong> {result.error}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                <strong>💡 This approach:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Uses axios instance with proper config</li>
                    <li>Automatically handles CSRF tokens</li>
                    <li>Maintains session cookies</li>
                    <li>Tests authentication after login</li>
                </ul>
            </div>
        </div>
    );
};

export default SimpleFixedLogin;