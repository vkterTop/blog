/**
 * 分类到拼音 slug 的映射。保持固定，避免 URL 变更。
 * 若新增分类，按语义补充拼音，多个字词用短横线分隔。
 */
const categorySlugs = {
  '方法论与思维': 'fangfa-yu-siwei',
  '服饰与汉服': 'fushi-yu-hanfu',
  '疆域与治理': 'jiangyu-yu-zhili',
  '军事与战争': 'junshi-yu-zhanzheng',
  '科技与生产': 'keji-yu-shengchan',
  '明朝历史': 'mingchao-lishi',
  '清朝历史': 'qingchao-lishi',
  '日本与侵华': 'riben-yu-qinhua',
  '思想与文化': 'sixiang-yu-wenhua',
  '西方与伪史': 'xifang-yu-weishi',
  '族群与认同': 'zuqun-yu-rentong',
  '其他综合': 'qita-zonghe',
};

/**
 * 取分类的拼音 slug。未知分类时按字符转拼音并兜底为 "uncategorized"。
 */
export function getCategorySlug(category) {
  if (!category || typeof category !== 'string') return 'uncategorized';
  const trimmed = category.trim();
  if (categorySlugs[trimmed]) return categorySlugs[trimmed];

  // 兜底：按简单汉字拼音表逐个转换，非汉字保留原样
  const pinyin = trimmed
    .split('')
    .map((c) => simplePinyinMap[c] || c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '');

  return pinyin || 'uncategorized';
}

/** 简单汉字拼音表（仅用于未知分类兜底） */
const simplePinyinMap = {
  方: 'fang', 法: 'fa', 论: 'lun', 与: 'yu', 思: 'si', 维: 'wei',
  服: 'fu', 饰: 'shi', 汉: 'han', 服: 'fu',
  疆: 'jiang', 域: 'yu', 治: 'zhi', 理: 'li',
  军: 'jun', 事: 'shi', 战: 'zhan', 争: 'zheng',
  科: 'ke', 技: 'ji', 生: 'sheng', 产: 'chan',
  明: 'ming', 清: 'qing', 朝: 'chao', 历: 'li', 史: 'shi',
  日: 'ri', 本: 'ben', 侵: 'qin', 华: 'hua',
  思: 'si', 想: 'xiang', 文: 'wen', 化: 'hua',
  西: 'xi', 伪: 'wei',
  族: 'zu', 群: 'qun', 认: 'ren', 同: 'tong',
  其: 'qi', 他: 'ta', 综: 'zong', 合: 'he',
};

/** 从文件名中提取数字序号 */
export function extractNumberFromFileName(fileName) {
  const match = fileName.match(/(\d+)/);
  return match ? match[1].padStart(3, '0') : '000';
}

export function getCategoryLabel(slug) {
  const entry = Object.entries(categorySlugs).find(([, s]) => s === slug);
  return entry ? entry[0] : slug;
}

export { categorySlugs };
