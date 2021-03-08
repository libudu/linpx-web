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

  if (!users) return null;

  const userEle = Object.entries(users).map(([name, id]) => {
    return (
      <div key={id}>
        <Link to={`/pixiv/user/${id}`}>{name}</Link>
      </div>
    );
  });
  return (
    <div>
      <HomeNavbar>推荐作者</HomeNavbar>
      {userEle}
    </div>
  );
}
