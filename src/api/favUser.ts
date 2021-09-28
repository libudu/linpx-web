import { randomByDay } from '@/utils/util';
import { IFavUser } from '../types';
import { useLinpxSWR } from '.';

export const useFavUserIds = () => {
  const data = useLinpxSWR<IFavUser[]>('/fav/user');
  if (!data) return;
  return data
    .map((favUser) => favUser.id)
    .sort((a, b) => randomByDay(Number(a) * Number(b)) - 0.5);
};

export const useFavUser = () => {
  return useLinpxSWR<IFavUser[]>('/fav/user');
};

export const useFavUserById = (id: string) => {
  const favUsers = useFavUser();
  return favUsers?.find((favUser) => favUser.id === id);
};
