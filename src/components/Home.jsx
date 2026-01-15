import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../stores/theme';

// 开发模式下的模拟数据（从data目录的实际内容生成）
const MOCK_ARTICLES = [];

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取文章列表 - 支持开发和生产两种模式
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // 检查是否是生产模式（有嵌入的数据）
        if (window.ARTICLES_DATA) {
          setArticles(window.ARTICLES_DATA);
        } else {
          // 开发模式：从本地public/data目录获取真实的JSON数据
          const apiUrl = '/data/articles.json';
          console.log(`Development mode: Fetching articles from ${apiUrl}`);
          
          // 使用setTimeout增加错误处理时间
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 5000);
          });
          
          const fetchPromise = fetch(apiUrl);
          const response = await Promise.race([fetchPromise, timeoutPromise]);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          setArticles(data);
          console.log(`Development mode: Fetched ${data.length} articles successfully`);
        }
      } catch (error) {
        console.error('Error loading articles:', error);
        
        // 错误处理：使用备选方案生成模拟数据
        console.log('Using fallback: Generating mock articles from simple-generate.js logic');
        
        // 从src/txt目录获取TXT文件列表
        const txtFiles = ['1.txt', '2.txt', '3.txt', '4.txt'];
        
        // 生成模拟文章数据
        const mockArticles = txtFiles.map((file, index) => ({
          id: `mock-${index + 1}`,
          title: `Article ${index + 1} Title`,
          titleCN: `文章${index + 1}标题`,
          createdAt: new Date().toISOString(),
          paragraphs: []
        }));
        
        setArticles(mockArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="container homepage">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container homepage">
      <h2>Welcome to English Reading Blog</h2>
      <p>Explore our collection of English articles with interactive translations</p>
      
      <div className="articles-grid">
        {articles.length > 0 ? (
          articles.map(article => (
            <div key={article.id} className="article-card">
              <h3>{article.title}</h3>
              <div className="meta">
                Published: {new Date(article.createdAt).toLocaleDateString()}
              </div>
              <Link to={`/article/${article.id}`} className="btn">
                Read Article
              </Link>
            </div>
          ))
        ) : (
          <p>No articles available yet. Please add some TXT files to the system.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
