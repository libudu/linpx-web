export const getLinpxNovelShareInfo = (id: string) => {
  const path = '/linpx/share/' + id;
  const url = location.origin + path;
  return { url, path };
};
