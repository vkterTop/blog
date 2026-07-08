import { categorySlugs, getCategoryLabel } from './pinyin.js';
import { getColumnSlug } from './columns.js';
import { withBase } from './path.js';

/** Parse a post slug like 'qita-zonghe-001' into categorySlug and numberSlug */
export function parsePostSlug(slug) {
  const match = slug.match(/^(.*)-(\d{3})$/);
  if (!match) return { categorySlug: 'qita-zonghe', numberSlug: '000' };
  const categorySlug = match[1];
  const numberSlug = match[2];
  return { categorySlug, numberSlug };
}

/**
 * Build a post URL path.
 * Accepts either a post object (with slug + data.column) or a raw slug string.
 * String form uses the default column for backward compatibility in helpers.
 */
export function getPostUrlPath(slugOrPost) {
  let slug;
  let columnSlug;
  if (typeof slugOrPost === 'string') {
    slug = slugOrPost;
    columnSlug = getColumnSlug();
  } else {
    slug = slugOrPost.slug;
    columnSlug = getColumnSlug(slugOrPost.data?.column);
  }
  const { categorySlug, numberSlug } = parsePostSlug(slug);
  return withBase(`/zhuanlan/${columnSlug}/${categorySlug}/${numberSlug}/`);
}

/** Build a category URL path under a column */
export function getCategoryUrlPath(categorySlug, columnSlug) {
  return withBase(`/zhuanlan/${columnSlug || getColumnSlug()}/${categorySlug}/`);
}

export { getCategoryLabel };
export { categorySlugs };
