import { randomByDay } from '@/utils/util';
import { IFavUser } from '../types';
import useSWR from 'swr';

export const useFavUserIds = () => {
  const { data } = useSWR<IFavUser[]>('/fav/user');
  if (!data) return;
  return data
    .map((favUser) => favUser.id)
    .sort((a, b) => randomByDay(Number(a) * Number(b)) - 0.5);
};

export const useFavUser = () => {
  const { data } = useSWR<IFavUser[]>('/fav/user');
  return data;
};

export const useFavUserById = (id: string) => {
  const favUsers = useFavUser();
  return favUsers?.find((favUser) => favUser.id === id);
};
