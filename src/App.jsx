import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useThemeStore } from './stores/theme';
import Home from './components/Home';
import Article from './components/Article';

function App() {
  // 获取主题store
  const themeStore = useThemeStore(window.pinia);

  // 初始化主题
  useEffect(() => {
    themeStore.initTheme();
  }, []);

  return (
    <Router>
      <div className="app">
        {/* 导航栏 */}
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              <h1>English Reading Blog</h1>
            </Link>
            
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
                  value={themeStore.currentFont}
                  onChange={(e) => themeStore.setFont(e.target.value)}
                  style={{
                    backgroundColor: '#34495e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
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
      </div>
    </Router>
  );
}

export default App;
