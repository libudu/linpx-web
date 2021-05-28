export * from './favUser';
export * from './novel';
export * from './search';
export * from './user';

import { IAnalyseTag } from '../types';
import useSWR from 'swr';

export const useAnalyseTag = () => {
  const { data } = useSWR<IAnalyseTag>('/analyse/tags');
  return data;
};
