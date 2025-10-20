import React, { useState } from 'react';
import axios from 'axios';

const AdvancedDebugLogin = () => {
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(false);

    const API_BASE = 'http://localhost:8000';

    const updateResult = (step, status, data, error = null) => {
        setResults(prev => ({
            ...prev,
            [step]: { status, data, error, timestamp: new Date().toLocaleTimeString() }
        }));
    };

    const testStep1 = async () => {
        console.log('🔍 Step 1: Testing CSRF Cookie...');
        try {
            const response = await axios.get(`${API_BASE}/sanctum/csrf-cookie`, {
                withCredentials: true
            });
            updateResult('step1', 'SUCCESS', response.data);
            console.log('✅ Step 1 SUCCESS:', response.data);
        } catch (error) {
            updateResult('step1', 'FAILED', null, error.message);
            console.error('❌ Step 1 FAILED:', error);
        }
    };

    const testStep2 = async () => {
        console.log('🔍 Step 2: Testing Login...');
        try {
            // First get CSRF token
            await axios.get(`${API_BASE}/sanctum/csrf-cookie`, {
                withCredentials: true
            });

            // Then attempt login
            const response = await axios.post(`${API_BASE}/api/login`, {
                email: 'user@cinema.com',
                password: 'password'
            }, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            updateResult('step2', 'SUCCESS', response.data);
            console.log('✅ Step 2 SUCCESS:', response.data);
        } catch (error) {
            updateResult('step2', 'FAILED', null, {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            console.error('❌ Step 2 FAILED:', error.response?.data || error.message);
        }
    };

    const testStep3 = async () => {
        console.log('🔍 Step 3: Testing User Endpoint...');
        try {
            const response = await axios.get(`${API_BASE}/api/user`, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            updateResult('step3', 'SUCCESS', response.data);
            console.log('✅ Step 3 SUCCESS:', response.data);
        } catch (error) {
            updateResult('step3', 'FAILED', null, {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
            console.error('❌ Step 3 FAILED:', error.response?.data || error.message);
        }
    };

    const runAllTests = async () => {
        setLoading(true);
        setResults({});
        
        await testStep1();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testStep2();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testStep3();
        
        setLoading(false);
    };

    const ResultCard = ({ step, title, result }) => (
        <div className={`p-4 border rounded mb-4 ${
            result?.status === 'SUCCESS' ? 'border-green-500 bg-green-50' : 
            result?.status === 'FAILED' ? 'border-red-500 bg-red-50' : 
            'border-gray-300'
        }`}>
            <h3 className="font-bold text-lg mb-2">
                {step}: {title}
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
                            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </div>
                    )}
                    
                    {result.error && (
                        <div className="mt-2">
                            <strong>Error:</strong>
                            <pre className="bg-red-100 p-2 rounded mt-1 overflow-auto text-red-700">
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
            <h1 className="text-3xl font-bold mb-6">🧪 Authentication Debug System</h1>
            
            <div className="mb-6">
                <button 
                    onClick={runAllTests}
                    disabled={loading}
                    className="bg-blue-500 text-white px-6 py-3 rounded mr-4 disabled:opacity-50"
                >
                    {loading ? '🔄 Running Tests...' : '🚀 Run All Tests'}
                </button>
                
                <button onClick={testStep1} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                    Test Step 1
                </button>
                <button onClick={testStep2} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                    Test Step 2
                </button>
                <button onClick={testStep3} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Test Step 3
                </button>
            </div>

            <div className="space-y-4">
                <ResultCard 
                    step="Step 1" 
                    title="CSRF Cookie Test" 
                    result={results.step1} 
                />
                
                <ResultCard 
                    step="Step 2" 
                    title="Login Authentication Test" 
                    result={results.step2} 
                />
                
                <ResultCard 
                    step="Step 3" 
                    title="User Endpoint Test" 
                    result={results.step3} 
                />
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded">
                <h3 className="font-bold mb-2">🎯 Troubleshooting Guide:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Step 1 Fails:</strong> Backend CSRF route issue or CORS problem</li>
                    <li><strong>Step 2 Fails (419):</strong> CSRF token not being sent properly</li>
                    <li><strong>Step 2 Fails (401):</strong> Invalid credentials or auth logic issue</li>
                    <li><strong>Step 3 Fails:</strong> Session/cookie not persisting between requests</li>
                </ul>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-300 rounded">
                <h3 className="font-bold mb-2">📋 Test Credentials:</h3>
                <p>Email: user@cinema.com</p>
                <p>Password: password</p>
            </div>
        </div>
    );
};

export default AdvancedDebugLogin;