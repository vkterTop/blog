# Astro 静态博客实施计划：「素笺墨韵」古典汉风

> 项目目录：`D:\my\guajie\blog`
> 风格：高端大气 · 古典汉风 · 移动端优先 · 阅读为本  
> 数据源：`D:\my\guajie\sucai_questions` 约 2000+ 篇 JSON 文章

---

## 1. 目标

基于 `D:\my\guajie\sucai_questions` 下的 JSON 文章数据，搭建可静态导出的 Astro 博客，部署于低配置服务器。内容以历史、文化、汉服、疆域、军事等中文长文为主，视觉风格定位为「素笺墨韵」——宣纸为底、浓墨为文、朱砂为点，营造书斋案头的沉静阅读体验。

---

## 2. 上下文

- **数据源**：`D:\my\guajie\sucai_questions` 下约 2000+ 个 JSON 文件。
- **JSON 字段**：`category`（分类）、`title`（标题）、`content`（正文）、`keywords`（关键词数组）。
- **汇总文件**：`_summary.json` 记录各分类数量。
- **分类示例**：方法论与思维、服饰与汉服、疆域与治理、军事与战争、科技与生产、明朝历史、清朝历史、日本与侵华、思想与文化、西方与伪史、族群与认同、其他综合。
- **约束**：静态导出、低服务器配置、可扩展字段、移动端优先、少 JS。

---

## 3. 设计决策

### 3.1 内容组织：JSON 转 Markdown 后纳入 Content Collections

- 使用 Node.js 脚本将 JSON 转换为 `src/content/posts/` 下的 Markdown 文件。
- frontmatter 承载元数据，正文承载 `content`。
- 保留 JSON 源数据，脚本可重复运行，支持增量/全量重建。

### 3.2 项目结构

```
D:\my\guajie\blog
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── tailwind.config.mjs
├── public/
│   └── favicon.svg              # 印章风格 SVG 图标
├── scripts/
│   └── import-content.js        # JSON → Markdown 导入脚本
├── src/
│   ├── assets/
│   │   └── textures/            # 宣纸噪点、水墨占位图
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── MobileMenu.astro
│   │   ├── PostCard.astro
│   │   ├── CategoryCard.astro
│   │   ├── Pagination.astro
│   │   ├── SearchBox.astro
│   │   ├── ThemeToggle.astro
│   │   ├── Footer.astro
│   │   └── ScrollToTop.astro
│   ├── content/
│   │   ├── config.ts            # 集合 schema
│   │   └── posts/               # 生成的 Markdown 文章
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── archive.astro
│   │   ├── search.astro
│   │   ├── [category].astro
│   │   └── [category]/[slug].astro
│   ├── styles/
│   │   └── global.css
│   └── utils/
│       └── pinyin.js            # 中文转拼音 slug（若使用拼音 URL）
└── dist/                        # 静态构建产物
```

### 3.3 数据导入脚本

- 位置：`scripts/import-content.js`
- 功能：
  1. 清空/重建 `src/content/posts/`。
  2. 读取 `D:\my\guajie\sucai_questions` 下所有 `.json`（跳过 `_summary.json`）。
  3. 提取字段：`title`、`category`、`keywords`、`content`。
  4. 派生字段：
     - `slug`：基于分类与文件名生成（中文 URL 或拼音，待确认）。
     - `pubDate`：默认文件修改时间，未来可由 `publishTime` 覆盖。
  5. 写入 Markdown，frontmatter 包含所有字段。
  6. 未知字段透传，确保未来扩展无缝接入。

### 3.4 Schema 设计（`src/content/config.ts`）

```ts
import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    keywords: z.array(z.string()).default([]),
    slug: z.string(),
    pubDate: z.date().optional(),
    updatedDate: z.date().optional(),
    description: z.string().optional(),
    coverImage: z.string().optional(),
  }).passthrough(),
});

export const collections = { posts: postsCollection };
```

### 3.5 路由与 URL

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 首屏 + 分类入口 + 最新文章 |
| 分类页 | `/[category]/` | 某分类文章列表，分页每页 20 篇 |
| 文章详情 | `/[category]/[slug]/` | 单篇文章展示 |
| 归档页 | `/archive/` | 全部文章按时间倒序 |
| 搜索页 | `/search/` | 前端读取 `search.json` 索引搜索 |

- **URL 风格**：中文 URL 或拼音 URL（待确认）。
- **分类 slug**：中文 URL 编码，或拼音。
- **文章 slug**：基于文件名序号，确保唯一。

### 3.6 静态导出配置

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://yourdomain.com',     // 待确认
  build: { format: 'directory' },
});
```

---

## 4. 视觉设计规范

### 4.1 设计解读

- **页面类型**：历史/文化类中文博客，以长文阅读为核心。
- **设计语言**：「素笺墨韵」——宣纸、朱砂、墨黑，辅以现代栅格与留白。
- **三档设定**：
  - `DESIGN_VARIANCE: 6`（编辑式不对称，正文严格居中）
  - `MOTION_INTENSITY: 3`（内容为本，动态克制）
  - `VISUAL_DENSITY: 3`（大量留白，行距宽松）

### 4.2 色彩系统

**浅色模式（默认）**

| 角色 | 色值 | 用途 |
|------|------|------|
| 背景主色 | `#f7f4ef` | 页面底色，米白宣纸 |
| 背景次色 | `#efe9e0` | 卡片、导航、页脚 |
| 背景强调 | `#e7e0d5` | hover、引用块 |
| 文字主色 | `#1a1714` | 正文标题，浓墨 |
| 文字次色 | `#5e5851` | 摘要、元信息 |
| 弱化文字 | `#9b948b` | 时间戳、标签 |
| 主强调色 | `#b83a3a` | 朱砂红，链接/激活态/印章 |
| 主强调悬停 | `#9c2e2e` | 按钮/链接 hover |
| 次要强调 | `#8c6b3d` | 古铜金，装饰线/引号 |
| 分隔线 | `#d8d2c9` | hairline 边框 |

**深色模式**

| 角色 | 色值 |
|------|------|
| 背景主色 | `#121110` |
| 背景次色 | `#1a1816` |
| 背景强调 | `#24211e` |
| 文字主色 | `#e8e4dd` |
| 文字次色 | `#a8a39b` |
| 弱化文字 | `#6f6a62` |
| 主强调色 | `#d85c5c` |
| 次要强调 | `#c4a66f` |
| 分隔线 | `#2f2c28` |

### 4.3 字体系统

```css
--font-display: "Noto Serif SC", "Source Han Serif SC", "STSong", "SimSun", serif;
--font-body: "Noto Serif SC", "Source Han Serif SC", "PingFang SC", "Microsoft YaHei", serif;
--font-decorative: "Ma Shan Zheng", "ZCOOL XiaoWei", "STKaiti", cursive; /* 仅印章/装饰 */
```

- 正文与标题使用 **思源宋体/Noto Serif SC**，端庄可读。
- **Ma Shan Zheng** 仅用于首屏印章或局部装饰，禁止用于正文。
- 西文配对：`Crimson Pro` 或 `EB Garamond`。
- 因中文字体体积大，建议 Google Fonts 或 CDN 加载，并设 `font-display: swap`。

### 4.4 字号与行距

| 元素 | 桌面 | 移动 | 行高 | 字间距 |
|------|------|------|------|--------|
| 站点标题 | 2.25rem | 1.75rem | 1.2 | 0.05em |
| 文章 H1 | 2.5rem | 1.875rem | 1.35 | 0.02em |
| 文章 H2 | 1.875rem | 1.5rem | 1.4 | 0.01em |
| 文章 H3 | 1.5rem | 1.25rem | 1.45 | 0 |
| 正文 | 1.125rem | 1rem | 1.85 | 0.02em |
| 摘要 | 0.9375rem | 0.875rem | 1.7 | 0 |

- 正文最大宽度 `42em`（约 720px），确保阅读舒适。
- 段落间距 `margin-bottom: 1.75em`。
- 中文不使用 `text-align: justify`。

### 4.5 布局系统

- 最大容器宽度：`1280px`。
- 正文阅读宽度：`720px`（`max-w-prose-chinese`）。
- 页面边距：移动端 `16px`，平板 `24px`，桌面 `32px`。
- 响应式断点：`sm 640px`、`md 768px`、`lg 1024px`、`xl 1280px`。
- 桌面端文章页右侧可加入 sticky 目录（TOC），移动端隐藏或收起。

### 4.6 组件风格

- **导航栏**：高度桌面 64px / 移动 56px，米白半透明 + 底部分隔线，移动端汉堡菜单展开全屏遮罩。
- **文章卡片**：方正（无圆角或 2px），左侧 hover 出现朱砂竖线，整体上浮 4px。
- **按钮**：主按钮朱砂底米白字，次按钮朱砂边框透明底，active 时 `scale(0.98)`。
- **标签**：小字、细边框、2px 圆角，hover 淡朱砂背景。
- **分页**：当前页朱砂圆点，其余透明。
- **引用块**：左侧古铜金竖线，背景略深。
- **页脚**：简洁版权 + 返回顶部按钮。

### 4.7 动效

- 页面加载：首屏淡入 + 上移 20px，0.6s ease-out。
- 文章列表滚动进入：卡片依次淡入，stagger 0.08s。
- 卡片 hover：上浮 4px + 阴影加深。
- 按钮 active：`scale(0.98)`。
- 所有动画仅使用 `transform` / `opacity`。
- 尊重 `prefers-reduced-motion`。

### 4.8 装饰元素

- 宣纸噪点纹理（固定伪元素，低透明度，不随滚动重绘）。
- 首屏底部水墨渐变过渡。
- 竖排文字仅用于首屏装饰。
- 小面积 SVG 印章。
- 禁用：霓虹光晕、紫色渐变、圆角过大、自定义鼠标指针、大面积 emoji。

---

## 5. 页面清单

### 5.1 首页 `/`

- 首屏（Hero）：`min-h-[70dvh]`，左侧站点印章 + 简介 + 分类快速入口，右侧竖排装饰文字，背景宣纸噪点 + 水墨渐变。
- 分类入口：桌面 2 列，移动 1 列，每个卡片含分类名、文章数、关键词。
- 最新文章：桌面左侧时间线 + 右侧列表，移动单栏卡片。

### 5.2 分类页 `/[category]/`

- 分类标题 + 描述（2-3 句）+ 文章数量。
- 文章卡片网格：桌面 3 列，平板 2 列，移动 1 列。
- 数字分页，每页 20 篇。

### 5.3 文章详情页 `/[category]/[slug]/`

- 文章头：标题、分类、日期、关键词。
- 可选头图：无封面时使用水墨占位图。
- 正文：最大 720px，居中，宽松行距。
- 桌面 sticky TOC。
- 文章底部：关键词、上下篇导航、返回分类。

### 5.4 归档页 `/archive/`

- 全部文章按时间倒序。
- 时间线列表，按年份分组。

### 5.5 搜索页 `/search/`

- 搜索框 + 搜索按钮。
- 结果列表：标题、分类、摘要高亮、日期。
- 基于静态 `search.json` 索引。

---

## 6. 构建流程

1. 进入项目目录：`cd D:\my\guajie\blog`
2. 初始化项目：`npm create astro@latest -- --template minimal`（或 blog 模板）
3. 安装依赖：Tailwind CSS、RSS 集成等。
4. 编写 `scripts/import-content.js`。
5. 配置 `src/content/config.ts`。
6. 创建布局、组件、页面。
7. 定义全局样式与 CSS 变量。
8. 运行导入：`node scripts/import-content.js`（或 `npm run content:import`）
9. 开发预览：`npm run dev`
10. 构建静态站点：`npm run build`
11. 部署 `dist/` 到服务器。

---

## 7. 未来扩展

| 需求 | 处理方式 |
|------|----------|
| 新增文章 | 放入 `sucai_questions` 目录，重新导入并构建。 |
| `publishTime` 字段 | 导入脚本映射为 `pubDate`。 |
| `tags` 字段 | 透传至 frontmatter，schema 扩展。 |
| 评论 | 第三方 Giscus / Twikoo，无后端依赖。 |
| 统计 | Google Analytics / Plausible / Umami。 |
| RSS / Sitemap | `@astrojs/rss` + sitemap 集成。 |
| 全文搜索 | `search.json` 或 Algolia DocSearch。 |
| 多作者 | schema 添加 `author` 字段。 |
| 封面图 | 导入脚本支持 `coverImage` 字段。 |

---

## 8. 风险与注意事项

- **文章数量大**：2000+ 篇构建时间预计 1-5 分钟，静态输出对低配置服务器友好。
- **中文 URL**：若服务器对 URL 编码处理不一致，建议拼音 URL（待确认）。
- **内容长度**：单篇可能较长，导入脚本需正确处理 `\r\n` 到 Markdown 换行。
- **中文字体**：加载策略需平衡视觉效果与性能，建议系统字体优先回退。
- **全量重建**：当前方案为全量导入，未来可优化为增量导入。

---

## 9. 验证清单

- [ ] 导入脚本成功生成所有 Markdown，无报错。
- [ ] `astro dev` 可访问首页、分类页、文章详情页。
- [ ] `astro build` 成功，`dist/` 包含所有静态页面与资源。
- [ ] 分类页分页正常（每页 20 篇， Older/Newer 导航）。
- [ ] 文章详情页正确渲染标题、分类、关键词、正文。
- [ ] 搜索页可搜索标题与关键词。
- [ ] 新增 JSON 并重新导入后，新文章出现在站点中。
- [ ] 移动端导航、卡片、正文阅读正常。
- [ ] 深色模式切换正常。

---

## 10. 待确认事项

1. **项目目录**：是否放在 `D:\my\guajie\blog`？（是）
2. **URL 风格**：中文 URL 还是拼音 URL？（拼音 URL，服务器兼容性更好）
3. **站点名称/作者/域名**：是否现在确定？（「皇汉学堂/了了子/」）
4. **评论功能**：是否需要？（推荐：后期使用 Giscus）
5. **RSS / Sitemap**：是否需要？（默认开启）

---

*本计划融合技术实施与视觉规范，以「素笺墨韵」为核，务求在移动互联网时代复现一份端肃而温润的中文阅读体验。*
