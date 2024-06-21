import React, { useState } from 'react';
import ApiService from './services/ApiService';

const Total = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);

  const handleCalculateTotal = async () => {
    try {
      const response = await ApiService.calculateTotal();
      setTotalAmount(response.data.totalAmount);
    } catch (error) {
      console.error('Error calculating total:', error);
    }
  };

  const handlePay = async () => {
    try {
      const response = await ApiService.pay(paidAmount);
      alert(`Change: $${response.data.changeAmount.toFixed(2)}`);
      setTotalAmount(0);
      setPaidAmount(0);
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div className="total">
      <h2>Total</h2>
      <p>Total Amount: ${totalAmount.toFixed(2)}</p>
      <input
        type="number"
        value={paidAmount}
        onChange={(e) => setPaidAmount(e.target.value)}
      />
      <button onClick={handlePay}>Pay</button>
      <button onClick={handleCalculateTotal}>Calculate Total</button>
    </div>
  );
};

export default Total;
