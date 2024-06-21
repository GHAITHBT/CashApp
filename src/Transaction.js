import React, { useState } from 'react';
import ApiService from './services/ApiService';

const Transaction = () => {
  const [selectedArticle, setSelectedArticle] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToTransaction = async () => {
    try {
      await ApiService.addToTransaction(selectedArticle, quantity);
      alert('Item added to transaction!');
      setSelectedArticle('');
      setQuantity(1);
    } catch (error) {
      console.error('Error adding item to transaction:', error);
    }
  };

  return (
    <div className="transaction">
      <h2>Add to Transaction</h2>
      <select
        value={selectedArticle}
        onChange={(e) => setSelectedArticle(e.target.value)}
      >
        <option value="">Select an article</option>
        {/* Populate options dynamically from API */}
      </select>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={handleAddToTransaction}>Add</button>
    </div>
  );
};

export default Transaction;
