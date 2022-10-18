export const checkLinpxNovel = ({ desc }: { desc: string }) => {
  if (!desc) {
    return false;
  }
  desc = desc.toLowerCase();
  const isLinpxNovel =
    desc.includes('【linpx-novel】') || desc.includes('【linpxnovel】');
  return isLinpxNovel;
};
