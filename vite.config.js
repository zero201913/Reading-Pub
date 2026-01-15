import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
    // 配置静态资源访问
    middleware: [
      (req, res, next) => {
        console.log(`Processing request: ${req.url}`);
        
        // 处理/data/articles.json请求，返回所有文章的列表
        if (req.url === '/data/articles.json') {
          try {
            const dataDir = path.join(process.cwd(), 'data');
            console.log(`Looking for articles in: ${dataDir}`);
            
            if (!fs.existsSync(dataDir)) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Data directory not found' }));
              return;
            }
            
            const files = fs.readdirSync(dataDir);
            console.log(`Found files in data directory: ${files}`);
            
            const jsonFiles = files.filter(file => file.endsWith('.json') && file !== 'uuid-map.json');
            console.log(`Found JSON files: ${jsonFiles}`);
            
            const articles = jsonFiles.map(file => {
              const filePath = path.join(dataDir, file);
              const content = fs.readFileSync(filePath, 'utf-8');
              return JSON.parse(content);
            });
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(articles));
            console.log(`Successfully returned ${articles.length} articles`);
            return;
          } catch (error) {
            console.error('Error processing /data/articles.json:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal server error' }));
            return;
          }
        }
        
        // 其他请求继续处理
        next();
      }
    ],
    // 添加data目录作为静态资源
    watch: {
      include: ['src/**', 'data/**', 'index.html'],
    },
  },
  // 配置别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 添加JSON文件到资源包含列表
  assetsInclude: ['**/*.json'],
});
