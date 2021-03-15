import { useState, useEffect } from 'react';
import { IRouteProps, Link, history } from 'umi';
import { Pagination } from 'antd';

import {
  getPixivUserList,
  getRecommendPixivAuthors,
  IUserInfo,
} from '@/utils/api';

const pageSize = 6;

export default function () {
  const [allUserIds, setAllUserIds] = useState<string[]>([]);
  const [page, setPage] = useState<number>(
    Number(history.location?.query?.page) || 1,
  );
  const [users, setUsers] = useState<IUserInfo[]>([]);

  useEffect(() => {
    getRecommendPixivAuthors().then((res) => {
      setAllUserIds(res);
      // 当前页码数小于1或大于最大时，需要修正
      const maxPage = Math.ceil(res.length / pageSize);
      const truePage = page < 1 ? 1 : page > maxPage ? maxPage : page;
      setPage(truePage);
      // 当前显示的id
      console.log('set page');
      const showIds = res.slice((truePage - 1) * pageSize, truePage * pageSize);
      getPixivUserList(showIds).then((res) => {
        setUsers(res);
      });
    });
  }, [page]);

  return (
    <div>
      {users.map((ele) => (
        <div key={ele.id}>
          <Link to={`/pixiv/user/${ele.id}`}>{ele.name}</Link>
        </div>
      ))}
      <div className="flex justify-center">
        <Pagination
          pageSize={pageSize}
          current={page}
          total={allUserIds.length}
          onChange={(page) => setPage(page)}
        />
      </div>
    </div>
  );
}
