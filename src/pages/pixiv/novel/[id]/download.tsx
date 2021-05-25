import { useEffect } from 'react';
import { IRouteProps, history } from 'umi';

export default function DownloadNovel({ match }: IRouteProps) {
  const id = match.params.id;
  useEffect(() => {
    window.open(
      `https://api.linpx.linpicio.com/pixiv/novel/${id}/download`,
      '_parent',
    );
    history.replace(`/pixiv/novel/${id}`);
  }, []);
  return <></>;
}
