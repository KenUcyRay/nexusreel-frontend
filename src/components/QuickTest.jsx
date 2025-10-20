import React from 'react';
import axios from 'axios';

const QuickTest = () => {
    const testLogin = async () => {
        try {
            console.log('Testing login...');
            
            // Step 1: Get CSRF token
            await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
                withCredentials: true
            });
            console.log('✅ CSRF token obtained');
            
            // Step 2: Login
            const response = await axios.post('http://localhost:8000/api/login', {
                email: 'user@cinema.com',
                password: 'password'
            }, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ Login successful:', response.data);
            alert('Login successful! Check console for details.');
            
        } catch (error) {
            console.error('❌ Login failed:', error.response?.data || error.message);
            alert(`Login failed: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Quick Login Test</h1>
            <button 
                onClick={testLogin}
                className="bg-blue-500 text-white px-6 py-3 rounded text-lg"
            >
                🚀 Test Login Now
            </button>
            <p className="mt-4 text-sm text-gray-600">
                Check browser console for detailed results
            </p>
        </div>
    );
};

export default QuickTest;