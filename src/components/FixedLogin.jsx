import React, { useState } from 'react';
import axios from 'axios';

const FixedLogin = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const testFixedLogin = async () => {
        setLoading(true);
        setResult('Testing fixed login...');

        try {
            // Step 1: Get CSRF token and extract it
            console.log('🔍 Getting CSRF token...');
            const csrfResponse = await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
                withCredentials: true
            });
            
            console.log('✅ CSRF response:', csrfResponse);
            
            // Step 2: Get CSRF token from cookie
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];
            
            console.log('🔍 CSRF Token from cookie:', csrfToken);
            
            // Step 3: Login with CSRF token in header
            const loginResponse = await axios.post('http://localhost:8000/api/login', {
                email: 'user@cinema.com',
                password: 'password'
            }, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(csrfToken || ''),
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            setResult(`✅ LOGIN SUCCESS!\n${JSON.stringify(loginResponse.data, null, 2)}`);
            console.log('✅ Login successful:', loginResponse.data);
            
        } catch (error) {
            const errorMsg = `❌ LOGIN FAILED!\nStatus: ${error.response?.status}\nMessage: ${error.response?.data?.message || error.message}`;
            setResult(errorMsg);
            console.error('❌ Login failed:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">🔧 Fixed Login Test</h1>
            
            <button 
                onClick={testFixedLogin}
                disabled={loading}
                className="bg-green-500 text-white px-6 py-3 rounded mb-6 disabled:opacity-50"
            >
                {loading ? '🔄 Testing...' : '🚀 Test Fixed Login'}
            </button>
            
            <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-bold mb-2">Result:</h3>
                <pre className="whitespace-pre-wrap text-sm">
                    {result || 'Click button to test login with proper CSRF token handling'}
                </pre>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded">
                <h3 className="font-bold mb-2">🔧 Fix Applied:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Extract CSRF token from cookie</li>
                    <li>Send token in X-XSRF-TOKEN header</li>
                    <li>Add X-Requested-With header</li>
                    <li>Proper URL decode of token</li>
                </ul>
            </div>
        </div>
    );
};

export default FixedLogin;