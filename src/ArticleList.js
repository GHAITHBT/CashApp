import React, { useState, useEffect } from 'react';
import ApiService from './services/ApiService';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await ApiService.getArticles();
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="article-list">
      <h2>Articles</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            {article.name} - ${article.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleList;
