export * from './favUser';
export * from './novel';
export * from './search';
export * from './user';

import { IAnalyseTag } from '../types';
import useSWR from 'swr';
import { linpxRequest } from './util/request';

export const useLinpxSWR = <T>(path: string | null) => {
  const { data } = useSWR<T>(path, linpxRequest, { revalidateOnFocus: false });
  return data;
};

export const useAnalyseTag = () => {
  return useLinpxSWR<IAnalyseTag>('/analyse/tags');
};
