import { defineStore } from 'pinia';

// 定义主题store
export const useThemeStore = defineStore('theme', {
  // 状态定义
  state: () => ({
    // 默认使用浅色主题
    isDarkMode: false,
    // 纸张颜色选项
    paperColors: ['#ffffff', '#f5f5dc', '#e8f4f8', '#fffaf0', '#f0fff4'],
    // 当前纸张颜色
    currentPaperColor: '#ffffff',
    // 字体选项
    fonts: [
      { name: 'Arial', value: 'Arial, sans-serif' },
      { name: 'Times', value: 'Times New Roman, serif' },
      { name: 'Georgia', value: 'Georgia, serif' },
      { name: 'Verdana', value: 'Verdana, sans-serif' },
      { name: 'Courier', value: 'Courier New, monospace' }
    ],
    // 当前字体
    currentFont: 'Arial, sans-serif'
  }),

  // 持久化配置
  persist: {
    key: 'theme',
    storage: window.localStorage,
  },

  // 方法定义
  actions: {
    // 切换主题
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.updateDocumentTheme();
    },

    // 设置主题
    setTheme(isDark) {
      this.isDarkMode = isDark;
      this.updateDocumentTheme();
    },

    // 设置纸张颜色
    setPaperColor(color) {
      this.currentPaperColor = color;
      this.updateDocumentTheme();
    },

    // 设置字体
    setFont(font) {
      this.currentFont = font;
      this.updateDocumentTheme();
    },

    // 更新文档主题类
    updateDocumentTheme() {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
      
      // 更新纸张颜色
      document.documentElement.style.setProperty('--paper-color', this.isDarkMode ? '#1a1a1a' : this.currentPaperColor);
      
      // 更新字体
      document.documentElement.style.setProperty('--font-family', this.currentFont);
    },

    // 初始化主题
    initTheme() {
      this.updateDocumentTheme();
    }
  },

  // 计算属性
  getters: {
    // 获取当前主题类名
    themeClass() {
      return this.isDarkMode ? 'dark-mode' : 'light-mode';
    },

    // 获取当前主题配置
    themeConfig() {
      return this.isDarkMode ? {
        bgColor: '#000000',
        textColor: '#ffffff',
        paperBg: '#1a1a1a',
        highlightBg: '#ffd700',
        highlightText: '#000000',
        fontFamily: this.currentFont
      } : {
        bgColor: '#f5f5f5',
        textColor: '#333333',
        paperBg: this.currentPaperColor,
        highlightBg: '#ffff00',
        highlightText: '#000000',
        fontFamily: this.currentFont
      };
    }
  }
});
