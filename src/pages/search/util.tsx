import { getFavUserInfo } from '@/utils/api';

export const searchFavUser = async (word: string) => {
  const res = await getFavUserInfo();
  const idList = Object.values(res)
    .filter(({ name }) => name.includes(word))
    .map(({ id }) => id);
  return idList;
};
