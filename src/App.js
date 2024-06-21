import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addArticle = () => {
    // Validate inputs before adding article
    if (!barcode || !price || !quantity) {
      setMessage('Please fill out all fields to add an article.');
      return;
    }

    const newArticle = {
      barcode,
      price: parseFloat(price),
      quantity: parseInt(quantity)
    };
    setArticles([...articles, newArticle]);
    setBarcode('');
    setPrice('');
    setQuantity('');

    const newTotal = totalAmount + newArticle.price * newArticle.quantity;
    setTotalAmount(newTotal);
  };

  const handlePaidAmountChange = (e) => {
    const paid = parseFloat(e.target.value);
    setPaidAmount(paid);
    const change = paid - totalAmount;
    setMessage(`Change to give back: ${change.toLocaleString()}`);
  };

  const confirmTransaction = async () => {
    if (!paidAmount) {
      setMessage('Please enter the Paid Amount before confirming.');
      return;
    }
  
    try {
      const response = await axios.post('http://127.0.0.1/api1/index.php/api/transactions', {
        articles,
        paidAmount: parseFloat(paidAmount),
        totalAmount
      });
      setMessage(`Transaction saved successfully. Change to give back: ${response.data.changeAmount}`);
      setArticles([]);
      setPaidAmount('');
      setTotalAmount(0);
      fetchTransactions();
      // Remove success message after a few seconds
      setTimeout(() => {
        setMessage('');
      }, 3000); // 3 seconds timeout
    } catch (error) {
      console.error('Error saving transaction:', error);
      setMessage(`Failed to save transaction: ${error.response?.data?.error || error.message}`);
    }
  };
  
  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1/api1/index.php/api/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setMessage(`Failed to fetch transactions: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="app-container">
      <h1>Cash Register App</h1>
      <div className="main-content">
        <div className="form-container">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="barcode">Barcode</label>
              <input type="text" id="barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
            <button type="button" className="btn btn-primary" onClick={addArticle}>Add Article</button>
          </form>
        </div>

        <div className="transaction-details">
          <h2>Transaction Details</h2>
          <ul className="article-list">
            {articles.map((article, index) => (
              <li key={index} className="article-item">
                <strong>Barcode:</strong> {article.barcode} | <strong>Price:</strong> {article.price} | <strong>Quantity:</strong> {article.quantity}
              </li>
            ))}
          </ul>
          <div className="totals">
            <p>Total Amount: {totalAmount.toLocaleString()}</p>
            {totalAmount > 0 && (
              <div className="form-group">
                <label htmlFor="paidAmount">Paid Amount</label>
                <input type="number" id="paidAmount" value={paidAmount} onChange={handlePaidAmountChange} required />
              </div>
            )}
            <button type="button" className="btn btn-primary" onClick={confirmTransaction}>Confirm</button>
          </div>
        </div>
      </div>
      <p className={message.startsWith('Please') ? 'error-message' : 'success-message'}>{message}</p>
      <div className="transactions-list">
        <h2>All Transactions</h2>
        {transactions.map(transaction => (
          <div key={transaction.transaction_id} className="transaction-item">
            <p><strong>Date:</strong> {new Date(transaction.transaction_date).toLocaleString()}</p>
            <p><strong>Total Amount:</strong> {transaction.total_amount ? transaction.total_amount.toLocaleString() : '-'}</p>
            <p><strong>Paid Amount:</strong> {transaction.paid_amount ? transaction.paid_amount.toLocaleString() : '-'}</p>
            <p><strong>Change Amount:</strong> {transaction.change_amount ? transaction.change_amount.toLocaleString() : '-'}</p>
            <ul className="article-list">
              {transaction.articles.map(article => (
                <li key={article.article_id} className="article-item">
                  <strong>Barcode:</strong> {article.barcode} | <strong>Price:</strong> {article.price} | <strong>Quantity:</strong> {article.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
