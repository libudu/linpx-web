import { useState, useEffect } from 'react';
import { IRouteProps, Link } from 'umi';

import { getRecommendPixivAuthors } from '@/utils/api';
import { HomeNavbar } from '@/components/Navbar';

import { IUserInfo } from '../user/[id]';

export default function () {
  const [users, setUsers] = useState<IUserInfo>();

  useEffect(() => {
    getRecommendPixivAuthors().then((res: any) => {
      setUsers(res);
    });
  }, []);

  return (
    <div>
      <HomeNavbar>推荐作者</HomeNavbar>
      {users &&
        Object.entries(users).map(([name, id]) => (
          <div key={id}>
            <Link to={`/pixiv/user/${id}?from=recommend`}>{name}</Link>
          </div>
        ))}
    </div>
  );
}
