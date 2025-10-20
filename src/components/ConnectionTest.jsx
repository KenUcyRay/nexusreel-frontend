import React, { useState } from 'react';
import axios from 'axios';

const ConnectionTest = () => {
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(false);

    const API_BASE = 'http://localhost:8000';

    const updateResult = (step, status, data, error = null) => {
        setResults(prev => ({
            ...prev,
            [step]: { status, data, error, timestamp: new Date().toLocaleTimeString() }
        }));
    };

    // Test 1: Basic Backend Connection
    const testConnection = async () => {
        console.log('🔍 Testing Backend Connection...');
        try {
            const response = await axios.get(`${API_BASE}/api/test`, {
                timeout: 5000
            });
            updateResult('connection', 'SUCCESS', response.data);
        } catch (error) {
            updateResult('connection', 'FAILED', null, {
                message: error.message,
                code: error.code,
                status: error.response?.status
            });
        }
    };

    // Test 2: CSRF Cookie with Headers
    const testCSRF = async () => {
        console.log('🔍 Testing CSRF with Headers...');
        try {
            const response = await axios.get(`${API_BASE}/sanctum/csrf-cookie`, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            // Check cookies after CSRF request
            const cookies = document.cookie;
            console.log('Cookies after CSRF:', cookies);
            
            updateResult('csrf', 'SUCCESS', {
                response: response.data,
                cookies: cookies,
                headers: response.headers
            });
        } catch (error) {
            updateResult('csrf', 'FAILED', null, error.message);
        }
    };

    // Test 3: Login with proper CSRF handling
    const testLogin = async () => {
        console.log('🔍 Testing Login with CSRF...');
        try {
            // First get CSRF cookie
            await axios.get(`${API_BASE}/sanctum/csrf-cookie`, {
                withCredentials: true
            });

            // Get CSRF token from cookie
            const token = getCsrfToken();
            console.log('CSRF Token found:', token ? 'YES' : 'NO');

            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            // Add CSRF token if available
            if (token) {
                headers['X-XSRF-TOKEN'] = token;
            }

            const response = await axios.post(`${API_BASE}/api/login`, {
                email: 'user@cinema.com',
                password: 'password'
            }, {
                withCredentials: true,
                headers
            });
            
            updateResult('login', 'SUCCESS', response.data);
        } catch (error) {
            updateResult('login', 'FAILED', null, {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                headers: error.response?.headers
            });
        }
    };

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

    // Test 4: Check Laravel Routes
    const testRoutes = async () => {
        console.log('🔍 Testing Laravel Routes...');
        try {
            const response = await axios.get(`${API_BASE}/api/routes-check`, {
                timeout: 5000
            });
            updateResult('routes', 'SUCCESS', response.data);
        } catch (error) {
            updateResult('routes', 'FAILED', null, {
                message: error.message,
                status: error.response?.status
            });
        }
    };

    const runAllTests = async () => {
        setLoading(true);
        setResults({});
        
        await testConnection();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await testCSRF();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await testLogin();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await testRoutes();
        
        setLoading(false);
    };

    const ResultCard = ({ step, title, result }) => (
        <div className={`p-4 border rounded mb-4 ${
            result?.status === 'SUCCESS' ? 'border-green-500 bg-green-50' : 
            result?.status === 'FAILED' ? 'border-red-500 bg-red-50' : 
            'border-gray-300'
        }`}>
            <h3 className="font-bold text-lg mb-2">
                {title}
                {result?.status === 'SUCCESS' && ' ✅'}
                {result?.status === 'FAILED' && ' ❌'}
            </h3>
            
            {result && (
                <div className="text-sm">
                    <p><strong>Status:</strong> {result.status}</p>
                    <p><strong>Time:</strong> {result.timestamp}</p>
                    
                    {result.data && (
                        <div className="mt-2">
                            <strong>Response:</strong>
                            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto text-xs">
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </div>
                    )}
                    
                    {result.error && (
                        <div className="mt-2">
                            <strong>Error:</strong>
                            <pre className="bg-red-100 p-2 rounded mt-1 overflow-auto text-red-700 text-xs">
                                {JSON.stringify(result.error, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">🔗 Backend-Frontend Connection Test</h1>
            
            <div className="mb-6">
                <button 
                    onClick={runAllTests}
                    disabled={loading}
                    className="bg-blue-500 text-white px-6 py-3 rounded mr-4 disabled:opacity-50"
                >
                    {loading ? '🔄 Testing...' : '🚀 Run All Tests'}
                </button>
                
                <button onClick={testConnection} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                    Test Connection
                </button>
                <button onClick={testCSRF} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                    Test CSRF
                </button>
                <button onClick={testLogin} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                    Test Login
                </button>
                <button onClick={testRoutes} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Test Routes
                </button>
            </div>

            <div className="space-y-4">
                <ResultCard 
                    title="1. Backend Connection Test" 
                    result={results.connection} 
                />
                
                <ResultCard 
                    title="2. CSRF Cookie Test" 
                    result={results.csrf} 
                />
                
                <ResultCard 
                    title="3. Login Authentication Test" 
                    result={results.login} 
                />
                
                <ResultCard 
                    title="4. Laravel Routes Test" 
                    result={results.routes} 
                />
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-300 rounded">
                <h3 className="font-bold mb-2">📋 Connection Status Guide:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Test 1 SUCCESS:</strong> Backend is running and accessible ✅</li>
                    <li><strong>Test 1 FAILED:</strong> Backend not running or CORS issue ❌</li>
                    <li><strong>Test 2 SUCCESS:</strong> CSRF cookie working ✅</li>
                    <li><strong>Test 3 SUCCESS:</strong> Authentication working ✅</li>
                    <li><strong>Test 4 SUCCESS:</strong> All routes configured ✅</li>
                </ul>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded">
                <h3 className="font-bold mb-2">🛠️ Backend Routes Needed:</h3>
                <pre className="text-sm bg-gray-100 p-2 rounded">
{`// Add to routes/api.php
Route::get('/test', function () {
    return response()->json(['message' => 'Backend connected!', 'time' => now()]);
});

Route::get('/routes-check', function () {
    return response()->json([
        'csrf_route' => route_exists('sanctum.csrf-cookie'),
        'login_route' => route_exists('login'),
        'user_route' => route_exists('user'),
        'timestamp' => now()
    ]);
});`}
                </pre>
            </div>
        </div>
    );
};

export default ConnectionTest;