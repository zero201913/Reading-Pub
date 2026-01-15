# English Reading Blog

一个具有交互式翻译和深色模式的英文阅读博客系统。

## 项目简介

该项目是一个英文阅读博客系统，允许用户阅读英文文章并查看对应的中文翻译。系统支持深色模式切换、字体选择和纸张颜色自定义等功能。

## 项目结构

```
ReadingPub/
├── dist/                  # 构建输出目录
├── public/                # 静态资源目录
│   └── data/              # 生成的JSON数据文件
├── src/                   # 源代码目录
│   ├── components/        # React组件
│   │   ├── Article.jsx    # 文章阅读组件
│   │   └── Home.jsx       # 首页组件
│   ├── stores/            # Pinia状态管理
│   │   └── theme.js       # 主题设置
│   ├── txt/               # 原始TXT文章文件
│   ├── App.jsx            # 应用入口组件
│   ├── index.css          # 全局样式
│   └── main.jsx           # 应用入口文件
├── index.html             # HTML模板
├── package.json           # 项目配置和依赖
├── simple-generate.js     # TXT转JSON数据生成脚本
└── vite.config.js         # Vite配置文件
```

## 安装和依赖

### 安装依赖

```bash
npm install
```

### 主要依赖

- React 19: UI框架
- React Router: 路由管理
- Pinia: 状态管理
- Vite: 构建工具

## 本地开发流程

### 1. 生成数据

首先，将src/txt目录下的TXT文件转换为JSON数据：

```bash
npm run generate-static
```

或直接运行脚本：

```bash
node simple-generate.js
```

这将在public/data目录下生成以下文件：
- 1.json, 2.json, 3.json, 4.json: 单篇文章的JSON数据
- articles.json: 所有文章的列表数据

### 2. 启动开发服务器

```bash
npm run dev
```

开发服务器将在http://localhost:5173启动。

### 3. 访问应用

在浏览器中访问http://localhost:5173即可查看应用。

## 数据转换（TXT到JSON）

### TXT文件格式要求

TXT文件应遵循以下格式：

```
英文标题
中文标题

英文段落1
中文翻译1

英文段落2
中文翻译2

...
```

### 转换示例

输入（TXT文件）：
```
Hello World
你好世界

This is a sample paragraph.
这是一个示例段落。
```

输出（JSON文件）：
```json
{
  "id": "1",
  "title": "Hello World",
  "titleCN": "你好世界",
  "createdAt": "2026-01-15T08:36:49.734Z",
  "paragraphs": [
    {
      "original": "This is a sample paragraph.",
      "translation": "这是一个示例段落。"
    }
  ]
}
```

## 构建流程

### 1. 生成最新数据

确保生成最新的数据文件：

```bash
npm run generate-static
```

### 2. 构建项目

```bash
npm run build
```

构建后的文件将输出到dist目录。

### 3. 预览构建结果

```bash
npm run preview
```

预览服务器将在http://localhost:4173启动。

## 测试流程

### 代码检查

```bash
npm run lint
```

这将使用ESLint检查代码质量。

### 手动测试

1. 启动开发服务器：`npm run dev`
2. 访问首页，检查文章列表是否正确显示
3. 点击文章，检查文章内容是否正确显示
4. 测试主题切换、字体选择和纸张颜色自定义功能
5. 测试深色/浅色模式切换

## 部署流程

### 1. 生成生产数据

```bash
npm run generate-static
```

### 2. 构建生产版本

```bash
npm run build
```

### 3. 部署构建文件

将dist目录下的所有文件部署到Web服务器。

#### 示例：使用Nginx部署

1. 安装Nginx
2. 将dist目录下的文件复制到Nginx的网站根目录（通常是/usr/share/nginx/html）
3. 配置Nginx（可选）：

```nginx
server {
    listen 80;
    server_name example.com;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. 启动或重启Nginx：

```bash
sudo systemctl start nginx
```

#### 示例：使用GitHub Pages部署

1. 修改package.json，添加homepage字段：

```json
"homepage": "https://yourusername.github.io/readingpub"
```

2. 安装gh-pages：

```bash
npm install --save-dev gh-pages
```

3. 添加部署脚本到package.json：

```json
"scripts": {
    "deploy": "gh-pages -d dist"
}
```

4. 构建并部署：

```bash
npm run build
npm run deploy
```

## 使用说明

### 阅读文章

1. 在首页点击任意文章卡片进入阅读页面
2. 阅读英文原文，鼠标悬停在高亮单词上可查看注释
3. 查看对应的中文翻译

### 自定义设置

1. **主题切换**：点击右上角的太阳/月亮图标切换深色/浅色模式
2. **纸张颜色**：点击导航栏中的颜色圆点选择纸张颜色
3. **字体选择**：使用字体下拉菜单选择喜欢的字体

## 功能特性

- ✅ 英文文章阅读
- ✅ 中文翻译对照
- ✅ 单词高亮和注释
- ✅ 深色/浅色模式切换
- ✅ 自定义纸张颜色
- ✅ 自定义字体
- ✅ 响应式设计
- ✅ 本地数据生成和管理

## 自定义配置

### 添加新文章

1. 在src/txt目录下创建新的TXT文件，命名为5.txt, 6.txt等
2. 按照TXT文件格式要求编写内容
3. 运行数据生成脚本：`npm run generate-static`
4. 新文章将自动出现在首页

### 主题自定义

在src/stores/theme.js中可以自定义：
- 纸张颜色选项
- 字体选项
- 默认主题设置

## 常见问题

### Q: 文章列表不显示
A: 请确保已运行数据生成脚本：`npm run generate-static`

### Q: 文章内容无法加载
A: 检查网络请求，确保JSON数据文件路径正确

### Q: 构建后页面空白
A: 检查路由配置和数据路径，确保在生产环境中可以正确访问数据文件

## 许可证

MIT License
