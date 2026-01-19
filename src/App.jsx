import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useThemeStore } from './stores/theme';
import Home from './components/Home';
import Article from './components/Article';
import Background from './components/Background';

// 创建搜索上下文
export const SearchContext = createContext();

// 搜索输入框组件
const SearchInput = ({ searchTerm, onSearchChange, onSearchSubmit }) => {
  // 处理搜索输入
  const handleSearchInput = (e) => {
    const term = e.target.value;
    onSearchChange(term);
  };

  // 处理搜索提交
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="搜索文章标题..."
          value={searchTerm}
          onChange={handleSearchInput}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            fontSize: '0.9rem',
            width: '200px',
            outline: 'none'
          }}
        />
      </form>
    </div>
  );
};

// 搜索提供者组件
const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const location = useLocation();
  const navigate = useNavigate();

  // 当搜索词改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 处理搜索输入变化
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    // 如果不在首页，跳转到首页
    if (location.pathname !== '/') {
      navigate('/');
    }
  }, [location.pathname, navigate]);

  // 处理搜索提交
  const handleSearchSubmit = useCallback(() => {
    // 搜索已经在handleSearchChange中处理了
  }, []);

  // 创建搜索输入框实例
  const searchInputElement = (
    <SearchInput 
      searchTerm={searchTerm} 
      onSearchChange={handleSearchChange} 
      onSearchSubmit={handleSearchSubmit} 
    />
  );

  return (
    <>
      {/* 将搜索输入框提供给子组件 */}
      <SearchContext.Provider value={{ 
        searchTerm, 
        currentPage, 
        itemsPerPage, 
        searchInputElement, 
        setCurrentPage 
      }}>
        {children}
      </SearchContext.Provider>
    </>
  );
};

// 自定义Hook用于访问搜索上下文
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

function App() {
  // 获取主题store
  const themeStore = useThemeStore(window.pinia);
  // 使用local state来管理字体选择器的状态
  const [selectedFont, setSelectedFont] = useState(themeStore.currentFont);

  // 初始化主题
  useEffect(() => {
    themeStore.initTheme();
    // 更新local state以匹配themeStore的状态
    setSelectedFont(themeStore.currentFont);
  }, []);

  // 当themeStore的currentFont变化时，更新local state
  useEffect(() => {
    setSelectedFont(themeStore.currentFont);
  }, [themeStore.currentFont]);

  return (
    <Router>
      {/* 背景图片组件 */}
      <Background />
      <div className="app">
        {/* 搜索提供者需要在Router内部 */}
        <SearchProvider>
          {/* 导航栏 */}
          <nav className="navbar">
            <div className="navbar-container">
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                <h1>English Reading Blog</h1>
              </Link>
              
              {/* 搜索输入框 - 使用SearchContext提供的组件实例 */}
              <SearchContext.Consumer>
                {({ searchInputElement }) => searchInputElement}
              </SearchContext.Consumer>
            
            {/* 中间的样式选择区域 */}
            <div className="style-options">
              {/* 纸张颜色选择 */}
              <div className="paper-colors">
                {themeStore.paperColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => themeStore.setPaperColor(color)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: `2px solid ${themeStore.currentPaperColor === color ? '#fff' : 'transparent'}`,
                      backgroundColor: color,
                      cursor: 'pointer',
                      margin: '0 4px',
                      padding: 0
                    }}
                    title={`设置纸张颜色为 ${color}`}
                  />
                ))}
              </div>
              
              {/* 字体选择 */}
              <div className="font-selector">
                <select
                  value={selectedFont}
                  onChange={(e) => {
                    console.log('字体选择器onChange事件触发:', e.target.value);
                    const newFont = e.target.value;
                    // 先更新local state
                    setSelectedFont(newFont);
                    // 然后更新themeStore
                    themeStore.setFont(newFont);
                  }}
                  style={{
                    backgroundColor: '#34495e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontFamily: selectedFont // 确保选择器自身也使用当前字体
                  }}
                >
                  {themeStore.fonts.map((font) => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* 主题切换按钮 */}
            <button
              onClick={() => themeStore.toggleTheme()}
              className="theme-toggle-btn"
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '8px'
              }}
              title={themeStore.isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
            >
              {themeStore.isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>
        
        {/* 路由配置 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<Article />} />
        </Routes>
        </SearchProvider>
      </div>
    </Router>
  );
}

export default App;
