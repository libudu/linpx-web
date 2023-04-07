const cacheBlockUserList = [
  '45122839', // Winkcat
];

export const isBlockUser = (userId: string) => {
  return cacheBlockUserList.includes(userId);
};
