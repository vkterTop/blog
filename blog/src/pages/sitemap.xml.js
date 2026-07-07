import { getCollection } from 'astro:content';
import { getColumnSlug, getColumnBySlug, columns } from '../utils/columns.js';
import { getPostUrlPath, getCategoryUrlPath } from '../utils/slug.js';
import { categorySlugs } from '../utils/pinyin.js';

export async function GET(context) {
  const site = context.site ? String(context.site) : 'https://huanghanxuetang.example.com';
  const siteUrl = site.endsWith('/') ? site : site + '/';

  const posts = await getCollection('posts');
  const postUrls = posts.map((post) => {
    const path = getPostUrlPath(post);
    return `${siteUrl}${path.replace(/^\//, '')}`;
  });

  const categoryUrls = [];
  const columnUrls = columns.map((col) => `${siteUrl}zhuanlan/${col.slug}/`);
  for (const col of columns) {
    const columnSlug = col.slug;
    for (const categorySlug of Object.values(categorySlugs)) {
      const hasPosts = posts.some(
        (p) =>
          getColumnSlug(p.data.column) === columnSlug &&
          p.slug.startsWith(`${categorySlug}-`)
      );
      if (hasPosts) {
        categoryUrls.push(`${siteUrl}${getCategoryUrlPath(categorySlug, columnSlug).replace(/^\//, '')}`);
      }
    }
  }

  const staticUrls = [
    `${siteUrl}`,
    `${siteUrl}archive/`,
    `${siteUrl}search/`,
    `${siteUrl}zhuanlan/`,
  ];

  const allUrls = [...staticUrls, ...columnUrls, ...categoryUrls, ...postUrls];
  const uniqueUrls = Array.from(new Set(allUrls));

  const entries = uniqueUrls
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === siteUrl ? '1.0' : url.endsWith('/') ? '0.8' : '0.6'}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
