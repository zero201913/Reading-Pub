import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../stores/theme';
import { useSearch } from '../App';

// 开发模式下的模拟数据（从data目录的实际内容生成）
const MOCK_ARTICLES = [];

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  // 使用搜索上下文
  const { searchTerm, currentPage, itemsPerPage, setCurrentPage } = useSearch();

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
        const txtFiles = ['1.txt', '2.txt', '3.txt', '4.txt', '5.txt', '6.txt', '7.txt', '8.txt', '9.txt', '10.txt'];
        
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

  // 根据搜索词过滤文章
  const filteredArticles = articles.filter(article => {
    const term = searchTerm.toLowerCase();
    return (
      article.title.toLowerCase().includes(term) || 
      (article.titleCN && article.titleCN.toLowerCase().includes(term))
    );
  });

  // 分页逻辑
  const indexOfLastArticle = currentPage * itemsPerPage;
  const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  // 分页导航
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      
      {/* 搜索结果信息 */}
      {searchTerm && (
        <p className="search-results">
          搜索结果: 找到 {filteredArticles.length} 篇文章匹配 "{searchTerm}"
        </p>
      )}
      
      <div className="articles-grid">
        {currentArticles.length > 0 ? (
          currentArticles.map(article => (
            <div key={article.id} className="article-card">
              {/* 同时显示英文和中文标题 */}
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{article.title}</h3>
              {article.titleCN && (
                <h4 style={{ 
                  fontSize: '1rem', 
                  color: '#7f8c8d', 
                  marginBottom: '1rem',
                  fontWeight: 'normal'
                }}>
                  {article.titleCN}
                </h4>
              )}
              <div className="meta">
                Published: {new Date(article.createdAt).toLocaleDateString()}
              </div>
              <Link to={`/article/${article.id}`} className="btn">
                Read Article
              </Link>
            </div>
          ))
        ) : (
          <p>No articles available yet. {searchTerm ? 'No articles match your search.' : 'Please add some TXT files to the system.'}</p>
        )}
      </div>
      
      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
              style={{
                padding: '8px 12px',
                margin: '0 4px',
                borderRadius: '4px',
                border: '1px solid #3498db',
                backgroundColor: currentPage === number ? '#3498db' : 'transparent',
                color: currentPage === number ? 'white' : '#3498db',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
