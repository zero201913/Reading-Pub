import React from 'react';
import ReactDOM from 'react-dom/client';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App';
import './index.css';

// 创建Pinia实例
const pinia = createPinia();

// 使用持久化插件
pinia.use(piniaPluginPersistedstate);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 将pinia实例挂载到window对象，以便在组件中使用
window.pinia = pinia;
