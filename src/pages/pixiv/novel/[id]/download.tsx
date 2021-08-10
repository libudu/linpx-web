import { BASE_URL } from '@/api/util/request';
import { useEffect } from 'react';
import { IRouteProps, history } from 'umi';

export default function DownloadNovel({ match }: IRouteProps) {
  const id = match.params.id;
  useEffect(() => {
    window.open(`${BASE_URL}/pixiv/novel/${id}/download`, '_parent');
    history.replace(`/pixiv/novel/${id}`);
  }, []);
  return <></>;
}
