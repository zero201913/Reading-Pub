import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useThemeStore } from '../stores/theme';

function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  // 用于跟踪当前激活的高亮词ID
  const [activeHighlightId, setActiveHighlightId] = useState(null);

  // 获取文章内容 - 支持开发和生产两种模式
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // 检查是否是生产模式（有嵌入的数据）
        if (window.ARTICLES_DATA) {
          const articles = window.ARTICLES_DATA;
          const foundArticle = articles.find(a => a.id === id);
          
          if (!foundArticle) {
            throw new Error('Article not found in production data');
          }
          
          setArticle(foundArticle);
        } else {
          // 开发模式：从本地public/data目录获取真实的JSON数据
          const apiUrlBase = '/data';
          console.log(`Development mode: Fetching article ${id} from ${apiUrlBase}/${id}.json`);
          
          // 方案1：直接获取单个文章的JSON文件
          try {
            const response = await fetch(`${apiUrlBase}/${id}.json`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const articleData = await response.json();
            setArticle(articleData);
            console.log(`Development mode: Fetched article ${id} successfully`);
          } catch (singleFetchError) {
            console.error(`Failed to fetch single article ${id}:`, singleFetchError);
            
            // 方案2：获取所有文章，然后筛选
            try {
              const response = await fetch(`${apiUrlBase}/articles.json`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const allArticles = await response.json();
              const foundArticle = allArticles.find(a => a.id === id);
              
              if (!foundArticle) {
                throw new Error(`Article ${id} not found in all articles`);
              }
              
              setArticle(foundArticle);
              console.log(`Development mode: Found article ${id} in all articles`);
            } catch (allFetchError) {
              console.error(`Failed to fetch article ${id} from all articles:`, allFetchError);
              throw allFetchError;
            }
          }
        }
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]); // 依赖项正确设置为id

  if (loading) {
    return (
      <div className="container reading-page">
        <div className="paper">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container reading-page">
        <div className="paper">
          <h1>Article Not Found</h1>
          <Link to="/" className="back-btn">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container reading-page">
      <div className="paper">
        <Link to="/" className="back-btn">
          Back to Home
        </Link>
        
        <h1>{article.title}</h1>
        {article.titleCN && <h2 style={{ color: '#7f8c8d', fontSize: '1.2rem', textAlign: 'center', marginBottom: '2rem' }}>{article.titleCN}</h2>}
        
        {article.paragraphs.map((paragraph, paragraphIndex) => {
          // 处理高亮词，格式：*单词*(含义)
          const renderOriginal = (text) => {
            // 使用正则表达式匹配高亮词
            const highlightRegex = /\*([^*]+)\*\(([^)]+)\)/g;
            const parts = [];
            let lastIndex = 0;
            let match;
            let id = 0;
            
            while ((match = highlightRegex.exec(text)) !== null) {
              // 添加匹配前的文本
              if (match.index > lastIndex) {
                parts.push(
                  <React.Fragment key={`text-${paragraphIndex}-${id}`}>
                    {text.substring(lastIndex, match.index)}
                  </React.Fragment>
                );
              }
              
              const word = match[1].trim();
              const definition = match[2].trim();
              const highlightId = `highlight-${paragraphIndex}-${id}`;
              const isActive = activeHighlightId === highlightId;
              
              // 添加高亮词
              parts.push(
                <span 
                  key={highlightId}
                  id={highlightId}
                  className={`highlight-word ${isActive ? 'active' : ''}`}
                  title={definition}
                  onMouseEnter={() => setActiveHighlightId(highlightId)}
                  onMouseLeave={() => setActiveHighlightId(null)}
                  onTouchStart={(e) => {
                    setActiveHighlightId(isActive ? null : highlightId);
                  }}
                  onTouchEnd={(e) => {
                    // 移除preventDefault()调用
                  }}
                  style={{ position: 'relative' }}
                >
                  {word}
                  {isActive && (
                    <div className="highlight-tooltip">
                      {definition}
                    </div>
                  )}
                </span>
              );
              
              lastIndex = match.index + match[0].length;
              id++;
            }
            
            // 添加剩余文本
            if (lastIndex < text.length) {
              parts.push(
                <React.Fragment key={`text-${paragraphIndex}-${id}`}>
                  {text.substring(lastIndex)}
                </React.Fragment>
              );
            }
            
            return parts;
          };
          
          return (
            <div key={paragraphIndex} className="paragraph">
              <div className="original">
                {renderOriginal(paragraph.original)}
              </div>
              <div className="translation">
                {paragraph.translation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Article;
