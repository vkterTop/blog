import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPostUrlPath } from '../utils/slug.js';

export async function GET(context) {
  const posts = await getCollection('posts');
  const sorted = posts
    .sort((a, b) => {
      const da = a.data.pubDate ? new Date(a.data.pubDate).getTime() : 0;
      const db = b.data.pubDate ? new Date(b.data.pubDate).getTime() : 0;
      return db - da;
    })
    .slice(0, 50);

  return rss({
    title: '皇汉学堂',
    description: '素笺墨韵，中文历史与文化长文。',
    site: context.site,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: getPostUrlPath(post),
    })),
    customData: `<language>zh-CN</language>
<copyright>© 了了子 · 皇汉学堂</copyright>
`,
  });
}
