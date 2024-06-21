import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your backend URL

const ApiService = {
  async getArticles() {
    const response = await axios.get(`${API_URL}/articles`);
    return response.data;
  },

  async addToTransaction(articleId, quantity) {
    const response = await axios.post(`${API_URL}/transactions/add`, {
      articleId,
      quantity,
    });
    return response.data;
  },

  async calculateTotal() {
    const response = await axios.get(`${API_URL}/transactions/calculate-total`);
    return response.data;
  },

  async pay(paidAmount) {
    const response = await axios.post(`${API_URL}/transactions/pay`, {
      paidAmount,
    });
    return response.data;
  },
}; 

export default ApiService;
