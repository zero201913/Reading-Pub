import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置路径
const TXT_DIR = path.join(__dirname, 'src', 'txt');
const OUTPUT_DIR = path.join(__dirname, 'public', 'data');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 读取所有TXT文件
const txtFiles = fs.readdirSync(TXT_DIR).filter(file => file.endsWith('.txt'));

// 转换单个TXT文件为JSON
function convertTxtToJson(fileName, content) {
  const lines = content.split('\n');
  let i = 0;
  const article = {
    id: fileName.replace('.txt', ''),
    title: '',
    titleCN: '',
    createdAt: new Date().toISOString(),
    paragraphs: []
  };

  // 解析标题
  if (i < lines.length) article.title = lines[i++].trim();
  if (i < lines.length) article.titleCN = lines[i++].trim();
  if (i < lines.length && lines[i].trim() === '') i++; // 跳过空行

  // 解析段落
  let paragraph = {
    original: '',
    translation: ''
  };

  while (i < lines.length) {
    const line = lines[i++].trim();

    if (line === '') {
      // 空行表示段落结束
      if (paragraph.original || paragraph.translation) {
        article.paragraphs.push({
          original: paragraph.original,
          translation: paragraph.translation
        });
        paragraph = { original: '', translation: '' };
      }
    } else if (!paragraph.original) {
      // 第一行是非空行，作为英文原文
      paragraph.original = line;
    } else if (!paragraph.translation) {
      // 第二行是非空行，作为中文翻译
      paragraph.translation = line;
    }
  }

  // 添加最后一个段落（如果有）
  if (paragraph.original || paragraph.translation) {
    article.paragraphs.push({
      original: paragraph.original,
      translation: paragraph.translation
    });
  }

  return article;
}

// 主函数
function main() {
  try {
    const articles = [];

    // 处理每个TXT文件
    for (const file of txtFiles) {
      console.log(`Processing file: ${file}`);
      const content = fs.readFileSync(path.join(TXT_DIR, file), 'utf8');
      const article = convertTxtToJson(file, content);
      articles.push(article);

      // 保存单个文章的JSON文件
      fs.writeFileSync(
        path.join(OUTPUT_DIR, `${article.id}.json`),
        JSON.stringify(article, null, 2),
        'utf8'
      );
      console.log(`Generated: ${OUTPUT_DIR}/${article.id}.json`);
    }

    // 保存所有文章的JSON文件
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'articles.json'),
      JSON.stringify(articles, null, 2),
      'utf8'
    );
    console.log(`Generated: ${OUTPUT_DIR}/articles.json`);

    console.log('\n✅ All files generated successfully!');
  } catch (error) {
    console.error('❌ Error generating files:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
