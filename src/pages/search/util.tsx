import { getFavUserInfo } from '@/utils/api';

export const searchFavUser = async (word: string) => {
  const res = await getFavUserInfo();
  const idList = Object.entries(res)
    .filter(([userName, _]) => userName.includes(word))
    .map(([_, userId]) => userId);
  return idList;
};
