import { defineStore } from 'pinia';

// 定义主题store
export const useThemeStore = defineStore('theme', {
  // 状态定义
  state: () => {
    console.log('Theme store initializing...');
    return {
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
    };
  },

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
      console.log('设置字体:', font);
      this.currentFont = font;
      this.updateDocumentTheme();
      // 手动保存到localStorage
      localStorage.setItem('theme', JSON.stringify({
        isDarkMode: this.isDarkMode,
        currentPaperColor: this.currentPaperColor,
        currentFont: this.currentFont
      }));
      console.log('字体已保存到localStorage:', localStorage.getItem('theme'));
    },

    // 更新文档主题类
    updateDocumentTheme() {
      console.log('更新文档主题类...');
      console.log('当前字体:', this.currentFont);
      
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
      
      // 更新纸张颜色
      const paperColor = this.isDarkMode ? '#1a1a1a' : this.currentPaperColor;
      document.documentElement.style.setProperty('--paper-color', paperColor);
      console.log('纸张颜色已更新:', paperColor);
      
      // 更新字体
      document.documentElement.style.setProperty('--font-family', this.currentFont);
      console.log('字体已更新:', this.currentFont);
      
      // 检查CSS变量是否正确设置
      const computedFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--font-family');
      console.log('计算后的字体:', computedFontFamily);
    },

    // 初始化主题
    initTheme() {
      console.log('初始化主题...');
      // 从localStorage加载主题数据
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        try {
          const parsedTheme = JSON.parse(savedTheme);
          console.log('从localStorage加载主题数据:', parsedTheme);
          // 恢复主题状态
          this.isDarkMode = parsedTheme.isDarkMode || false;
          this.currentPaperColor = parsedTheme.currentPaperColor || '#ffffff';
          this.currentFont = parsedTheme.currentFont || 'Arial, sans-serif';
        } catch (error) {
          console.error('解析localStorage中的主题数据失败:', error);
        }
      }
      // 更新文档主题
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
