// index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Passw0rd123', // Replace with your MySQL password
  database: 'cash_register'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.post('/api/transactions', (req, res) => {
    const { articles, paidAmount, totalAmount } = req.body;
    const changeAmount = paidAmount - totalAmount;
    const transactionDate = new Date();
  
    const sql = `INSERT INTO transactions (paid_amount, total_amount, change_amount, transaction_date) VALUES (?, ?, ?, ?)`;
    const transactionValues = [paidAmount, totalAmount, changeAmount, transactionDate];
  
    db.query(sql, transactionValues, (err, result) => {
      if (err) {
        console.error('Error inserting transaction:', err);
        return res.status(500).send({ error: 'Failed to save transaction', details: err });
      }
  
      const transactionId = result.insertId;
  
      const articleValues = articles.map(article => [transactionId, article.barcode, article.price, article.quantity]);
  
      const sqlArticles = `INSERT INTO articles (transaction_id, barcode, price, quantity) VALUES ?`;
      db.query(sqlArticles, [articleValues], (err, result) => {
        if (err) {
          console.error('Error inserting articles:', err);
          return res.status(500).send({ error: 'Failed to save articles', details: err });
        }
  
        res.send({ changeAmount });
      });
    });
  });
  
  app.get('/api/transactions', (req, res) => {
    const sql = `
      SELECT t.id AS transaction_id, t.paid_amount, t.total_amount, t.change_amount, t.transaction_date,
             a.id AS article_id, a.barcode, a.price, a.quantity
      FROM transactions t
      LEFT JOIN articles a ON t.id = a.transaction_id
      ORDER BY t.transaction_date DESC
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching transactions:', err);
        return res.status(500).send({ error: 'Failed to fetch transactions', details: err });
      }
  
      const transactions = results.reduce((acc, row) => {
        const { transaction_id, paid_amount, total_amount, change_amount, transaction_date, article_id, barcode, price, quantity } = row;
  
        if (!acc[transaction_id]) {
          acc[transaction_id] = {
            transaction_id,
            paid_amount,
            total_amount,
            change_amount,
            transaction_date,
            articles: []
          };
        }
  
        if (article_id) {
          acc[transaction_id].articles.push({ article_id, barcode, price, quantity });
        }
  
        return acc;
      }, {});
  
      res.send(Object.values(transactions));
    });
  });
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
