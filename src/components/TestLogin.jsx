import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

const TestLogin = () => {
    const [credentials, setCredentials] = useState({
        email: 'user@cinema.com',
        password: 'password'
    });
    const [result, setResult] = useState('');
    const { login } = useAuthContext();

    const handleTest = async () => {
        try {
            setResult('Testing login...');
            const response = await login(credentials);
            setResult(`Success: ${JSON.stringify(response, null, 2)}`);
        } catch (error) {
            setResult(`Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Test Login</h2>
            <div className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={handleTest}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Test Login
                </button>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {result}
                </pre>
            </div>
        </div>
    );
};

export default TestLogin;