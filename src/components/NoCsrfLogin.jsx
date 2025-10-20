import React, { useState } from 'react';
import axios from 'axios';

const NoCsrfLogin = () => {
    const [email, setEmail] = useState('user@cinema.com');
    const [password, setPassword] = useState('password');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            console.log('🔄 Attempting login without CSRF...');
            
            const response = await axios.post('http://localhost:8000/api/login', {
                email,
                password
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Login successful:', response.data);
            
            // Store token if provided
            if (response.data.token) {
                localStorage.setItem('auth_token', response.data.token);
            }
            
            setResult({
                status: 'success',
                message: 'Login berhasil!',
                data: response.data
            });

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

    const testAuthenticatedRequest = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('http://localhost:8000/api/user', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('✅ User data:', response.data);
            setResult(prev => ({
                ...prev,
                userData: response.data
            }));

        } catch (error) {
            console.error('❌ User request failed:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">🚫 No CSRF Login</h2>
            
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

            {result && result.status === 'success' && (
                <button
                    onClick={testAuthenticatedRequest}
                    className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                >
                    🧪 Test User Endpoint
                </button>
            )}

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
                </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <strong>🔑 Token-Based Auth (No CSRF):</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>No CSRF tokens needed</li>
                    <li>Uses Bearer token authentication</li>
                    <li>Simpler and more secure for APIs</li>
                    <li>Standard for SPA applications</li>
                </ul>
            </div>
        </div>
    );
};

export default NoCsrfLogin;