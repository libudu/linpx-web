const cacheBlockUserList = [
  '45122839', // Winkcat
  '19716045', // Zod
];

export const isBlockUser = (userId: string) => {
  return cacheBlockUserList.includes(userId);
};
