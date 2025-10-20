import React, { useState } from 'react';
import axios from 'axios';

const FixedAuthLogin = () => {
    const [credentials, setCredentials] = useState({
        email: 'user@cinema.com',
        password: 'password'
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const API_BASE = 'http://localhost:8000';

    // Helper function to get CSRF token from cookie
    const getCsrfToken = () => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'XSRF-TOKEN') {
                return decodeURIComponent(value);
            }
        }
        return null;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            console.log('🔍 Step 1: Getting CSRF cookie...');
            
            // Step 1: Get CSRF cookie
            await axios.get(`${API_BASE}/sanctum/csrf-cookie`, {
                withCredentials: true
            });

            console.log('🔍 Step 2: Checking CSRF token...');
            
            // Step 2: Get CSRF token from cookie
            const csrfToken = getCsrfToken();
            console.log('CSRF Token found:', csrfToken ? 'YES' : 'NO');

            // Step 3: Prepare headers
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            // Add CSRF token if available
            if (csrfToken) {
                headers['X-XSRF-TOKEN'] = csrfToken;
            }

            console.log('🔍 Step 3: Attempting login with headers:', headers);

            // Step 4: Login request
            const response = await axios.post(`${API_BASE}/api/login`, credentials, {
                withCredentials: true,
                headers
            });

            console.log('✅ Login SUCCESS:', response.data);
            setResult({
                status: 'SUCCESS',
                message: 'Login berhasil!',
                data: response.data
            });

            // Test authenticated request
            setTimeout(async () => {
                try {
                    const userResponse = await axios.get(`${API_BASE}/api/user`, {
                        withCredentials: true,
                        headers: { 'Accept': 'application/json' }
                    });
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
            console.error('❌ Login FAILED:', error);
            setResult({
                status: 'FAILED',
                message: error.response?.data?.message || error.message,
                error: {
                    status: error.response?.status,
                    data: error.response?.data
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">🔐 Fixed Login</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email:</label>
                    <input
                        type="email"
                        value={credentials.email}
                        onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Password:</label>
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? '🔄 Logging in...' : '🚀 Login'}
                </button>
            </form>

            {result && (
                <div className={`mt-4 p-4 rounded ${
                    result.status === 'SUCCESS' ? 'bg-green-50 border border-green-300' : 'bg-red-50 border border-red-300'
                }`}>
                    <h3 className="font-bold mb-2">
                        {result.status === 'SUCCESS' ? '✅ Success!' : '❌ Failed!'}
                    </h3>
                    <p className="text-sm mb-2">{result.message}</p>
                    
                    {result.data && (
                        <div className="mt-2">
                            <strong>Login Response:</strong>
                            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto">
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </div>
                    )}

                    {result.userData && (
                        <div className="mt-2">
                            <strong>User Data:</strong>
                            <pre className="bg-blue-100 p-2 rounded mt-1 text-xs overflow-auto">
                                {JSON.stringify(result.userData, null, 2)}
                            </pre>
                        </div>
                    )}
                    
                    {result.error && (
                        <div className="mt-2">
                            <strong>Error Details:</strong>
                            <pre className="bg-red-100 p-2 rounded mt-1 text-xs overflow-auto">
                                {JSON.stringify(result.error, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm">
                <strong>🔧 How this works:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Get CSRF cookie from Laravel</li>
                    <li>Extract XSRF-TOKEN from browser cookies</li>
                    <li>Send token in X-XSRF-TOKEN header</li>
                    <li>Make authenticated requests</li>
                </ol>
            </div>
        </div>
    );
};

export default FixedAuthLogin;