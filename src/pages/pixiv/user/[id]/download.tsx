import { usePixivUser } from '@/api';
import { BASE_URL } from '@/api/util/request';
import { useEffect } from 'react';
import { IRouteProps } from 'umi';

export default function DownloadUser({ match }: IRouteProps) {
  const id = match.params.id;
  const user = usePixivUser(id, true);
  useEffect(() => {
    if (user) {
      user.novels.forEach((id, i) => {
        setTimeout(() => {
          window.open(
            `${BASE_URL}/pixiv/novel/${id}/download/cache`,
            '_parent',
          );
        }, 1000 * i);
      });
    }
  }, [user]);
  return <></>;
}
