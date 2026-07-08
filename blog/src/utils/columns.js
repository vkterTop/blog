/**
 * 专栏配置。name 为显示名，slug 为 URL 用拼音，description 为简介。
 * 当前默认专栏为“吃瓜蒙主”，来日新增专栏只须按此格式追加。
 */
export const defaultColumn = '吃瓜蒙主';

export const columns = [
  {
    name: '吃瓜蒙主',
    slug: 'chigua-mengzhu',
    description: '吃瓜蒙主直播与长文转录，兼论历史、文化、时事。',
  },
];

export const columnSlugs = columns.reduce((acc, col) => {
  acc[col.name] = col.slug;
  return acc;
}, {});

/** 取专栏的拼音 slug；未知者回退默认专栏 */
export function getColumnSlug(name) {
  if (!name || typeof name !== 'string') return columnSlugs[defaultColumn];
  const trimmed = name.trim();
  return columnSlugs[trimmed] || columnSlugs[defaultColumn];
}

/** 由 slug 取专栏显示名 */
export function getColumnName(slug) {
  const col = columns.find((c) => c.slug === slug);
  return col ? col.name : slug;
}

/** 由 slug 取专栏完整对象 */
export function getColumnBySlug(slug) {
  return columns.find((c) => c.slug === slug) || columns[0];
}

export { getColumnSlug as getColumnLabel };
