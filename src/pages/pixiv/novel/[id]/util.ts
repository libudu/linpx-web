export const checkLinpxNovel = ({ desc }: { desc: string }) => {
  if (!desc) {
    return false;
  }
  // 忽视大小写，去除空格和分隔符
  desc = desc
    .toLowerCase()
    .replaceAll(' ', '')
    .replaceAll('-', '')
    .replaceAll('_', '');
  const isLinpxNovel =
    desc.includes('【linpx-novel】') ||
    desc.includes('【linpx互动小说】') ||
    desc.includes('【linpx交互小说】');
  return isLinpxNovel;
};

export const filterTitle = (title: string) => {
  if (title.startsWith('《') && title.endsWith('》')) {
    return title.slice(1, -1);
  }
  return title;
};
