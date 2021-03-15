import { useState, useEffect } from 'react';
import { IRouteProps, Link } from 'umi';

import { getRecommendPixivAuthors, IUserInfo } from '@/utils/api';

export default function () {
  const [users, setUsers] = useState<IUserInfo>();

  useEffect(() => {
    getRecommendPixivAuthors().then((res: any) => {
      setUsers(res);
    });
  }, []);

  return (
    <div>
      {users &&
        Object.entries(users).map(([name, id]) => (
          <div key={id}>
            <Link to={`/pixiv/user/${id}`}>{name}</Link>
          </div>
        ))}
    </div>
  );
}
