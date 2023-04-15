import { downloadNovel, usePixivUser } from '@/api';
import { useEffect } from 'react';
import { IRouteProps } from 'umi';

export default function DownloadUser({ match }: IRouteProps) {
  const id = match.params.id;
  const user = usePixivUser(id, true);
  useEffect(() => {
    if (user) {
      user.novels.forEach((id, i) => {
        setTimeout(() => {
          downloadNovel(id);
        }, 1000 * i);
      });
    }
  }, [user]);
  return <></>;
}
