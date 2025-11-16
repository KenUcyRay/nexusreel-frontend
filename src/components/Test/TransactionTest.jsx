import React, { useState } from 'react';
import api from '../../utils/api';

const TransactionTest = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const createSample = async () => {
    setLoading(true);
    try {
      const response = await api.post('/test/create-sample-transactions');
      console.log('Sample created:', response.data);
      fetchTransactions();
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Transaction Test</h2>
      
      <div className="space-x-2 mb-4">
        <button 
          onClick={createSample}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Sample Data'}
        </button>
        
        <button 
          onClick={fetchTransactions}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Fetch Transactions
        </button>
      </div>

      <div className="space-y-2">
        {transactions.map(t => (
          <div key={t.id} className="border p-3 rounded">
            <div className="font-bold">{t.type?.toUpperCase()}: {t.order_id}</div>
            <div>Amount: Rp {t.amount?.toLocaleString()}</div>
            <div>Status: {t.status}</div>
            <div>Email: {t.customer_email}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionTest;