import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCategorySlug, extractNumberFromFileName } from '../src/utils/pinyin.js';
import { getColumnSlug, defaultColumn } from '../src/utils/columns.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../src');
const POSTS_DIR = path.join(SRC_DIR, 'content', 'posts');
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const DATA_DIR = path.resolve(__dirname, '../../sucai_questions');

const SUMMARY_FILE = '_summary.json';
const SUMMARY_OUTPUT = path.join(PUBLIC_DIR, 'category-summary.json');
const SEARCH_INDEX = path.join(PUBLIC_DIR, 'search.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sanitizeContent(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

function escapeYamlValue(value) {
  if (!value || typeof value !== 'string') return value;
  if (/[:#\n\r'"{}\[\]>&*|!%@,]/.test(value)) {
    return '"' + value.replace(/"/g, '\\"') + '"';
  }
  return value;
}

function buildFrontmatter(data) {
  const lines = ['---'];
  const title = data.title || '未命名文章';
  const category = data.category || '其他综合';
  const column = data.column || defaultColumn;
  const keywords = Array.isArray(data.keywords) ? data.keywords : [];

  lines.push(`title: ${escapeYamlValue(title)}`);
  lines.push(`category: ${escapeYamlValue(category)}`);
  lines.push(`column: ${escapeYamlValue(column)}`);
  lines.push(`keywords: [${keywords.map((k) => `"${escapeYamlValue(k) || k}"`).join(', ')}]`);
  if (data.pubDate) lines.push(`pubDate: ${data.pubDate.toISOString()}`);
  if (data.description) lines.push(`description: ${escapeYamlValue(data.description)}`);
  if (data.coverImage) lines.push(`coverImage: ${escapeYamlValue(data.coverImage)}`);

  // 透传未知字段
  const known = ['title', 'category', 'column', 'keywords', 'content', 'pubDate', 'description', 'coverImage', 'publishTime', 'updatedDate'];
  for (const [key, value] of Object.entries(data)) {
    if (known.includes(key)) continue;
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map((v) => `"${escapeYamlValue(v)}"`).join(', ')}]`);
    } else if (typeof value === 'object') {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else {
      lines.push(`${key}: ${escapeYamlValue(String(value))}`);
    }
  }

  lines.push('---');
  return lines.join('\n');
}

function main() {
  console.log('Importing content from:', DATA_DIR);
  ensureDir(POSTS_DIR);
  ensureDir(PUBLIC_DIR);

  // 清空旧文章
  const existing = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  for (const f of existing) {
    fs.unlinkSync(path.join(POSTS_DIR, f));
  }

  if (!fs.existsSync(DATA_DIR)) {
    throw new Error(`Data directory not found: ${DATA_DIR}`);
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json') && f !== SUMMARY_FILE)
    .sort();

  const summary = {};
  const searchIndex = [];
  let imported = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    let json;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      console.warn(`Skipping invalid JSON: ${file}`, e.message);
      skipped++;
      continue;
    }

    if (!json || typeof json !== 'object') {
      skipped++;
      continue;
    }

    let category = json.category || '其他综合';
    let title = json.title || json.title?.toString() || '';
    const column = json.column || defaultColumn;

    // 兼容：若 JSON 中 category 为空，从文件名提取
    if (!category || category.trim() === '') {
      const parts = file.split('_');
      if (parts.length >= 2) {
        category = parts[0];
      } else {
        category = '其他综合';
      }
    }

    if (!title || title.trim() === '') {
      title = `${category} ${extractNumberFromFileName(file)}`;
    }

    const categorySlug = getCategorySlug(category);
    const numberSlug = extractNumberFromFileName(file);
    const slug = `${categorySlug}-${numberSlug}`;
    const columnSlug = getColumnSlug(column);

    const stats = fs.statSync(filePath);
    const pubDate = json.publishTime
      ? new Date(json.publishTime)
      : json.pubDate
      ? new Date(json.pubDate)
      : stats.mtime;

    const content = sanitizeContent(json.content || '');

    // 生成摘要（正文前 160 字）
    const description =
      json.description ||
      content
        .replace(/\n+/g, ' ')
        .replace(/[#*_`]/g, '')
        .slice(0, 160)
        .trim() + (content.length > 160 ? '……' : '');

    const frontmatter = buildFrontmatter({
      title: title.trim(),
      category: category.trim(),
      column: column.trim(),
      keywords: Array.isArray(json.keywords) ? json.keywords : [category.trim()],
      pubDate,
      description,
      coverImage: json.coverImage,
      ...json,
    });

    const outputFile = path.join(POSTS_DIR, `${slug}.md`);
    fs.writeFileSync(outputFile, frontmatter + '\n\n' + content, 'utf-8');

    summary[category] = (summary[category] || 0) + 1;
    searchIndex.push({
      title: title.trim(),
      category: category.trim(),
      categorySlug,
      column: column.trim(),
      columnSlug,
      slug,
      keywords: Array.isArray(json.keywords) ? json.keywords : [category.trim()],
      description,
      pubDate: pubDate.toISOString(),
    });

    imported++;
    if (imported % 500 === 0) {
      console.log(`  Imported ${imported} posts...`);
    }
  }

  // 写入分类汇总（按专栏分组）
  const outputSummary = {
    columns: {
      [defaultColumn]: {
        slug: getColumnSlug(defaultColumn),
        categories: summary,
      },
    },
  };
  fs.writeFileSync(SUMMARY_OUTPUT, JSON.stringify(outputSummary, null, 2), 'utf-8');
  // 写入搜索索引
  fs.writeFileSync(SEARCH_INDEX, JSON.stringify(searchIndex, null, 2), 'utf-8');

  console.log(`\nDone: imported ${imported}, skipped ${skipped}.`);
  console.log('Categories:', Object.keys(summary).length);
  console.log('Summary written to:', SUMMARY_OUTPUT);
  console.log('Search index written to:', SEARCH_INDEX);
}

main();
