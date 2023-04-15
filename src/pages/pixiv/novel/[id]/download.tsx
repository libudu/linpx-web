import { downloadNovel } from '@/api';
import { useEffect } from 'react';
import { IRouteProps, history } from 'umi';

export default function DownloadNovel({ match }: IRouteProps) {
  const id = match.params.id;
  useEffect(() => {
    downloadNovel(id);
    history.replace(`/pixiv/novel/${id}`);
  }, []);
  return <></>;
}
