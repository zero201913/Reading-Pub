import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../stores/theme';

// 导入所有背景图片
import bg1 from '../bg/1.jpg';
import bg2 from '../bg/2.jpg';
import bg3 from '../bg/3.jpg';
import bg4 from '../bg/4.jpg';
import bg5 from '../bg/5.jpg';
import bg6 from '../bg/6.jpg';
import bg7 from '../bg/7.jpg';
import bg8 from '../bg/8.jpg';

const Background = () => {
  // 获取主题store
  const themeStore = useThemeStore(window.pinia);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 背景图片数组
  const backgroundImages = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8];

  // 随机选择初始背景图片
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentImageIndex(randomIndex);
  }, []);

  // 定时切换背景图片（30秒）
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`background-container ${'light-mode'}`}
      style={{
        backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
      }}
    >
      <div className="background-overlay"></div>
    </div>
  );
};

export default Background;
