import { useState, useEffect } from 'react';
import { history } from 'umi';

import {
  getPixivNovelProfiles,
  getPixivUserList,
  getRecommendPixivAuthors,
  INovelProfile,
} from '@/utils/api';

import PageViewer from '@/components/PageViewer';
import UserCard, { NovelNumber } from '@/components/UserCard';

const pageSize = 6;

export default function () {
  document.title = 'Linpx - 推荐作者';
  // 推荐作者的id
  const [allUserIds, setAllUserIds] = useState<string[]>();

  useEffect(() => {
    getRecommendPixivAuthors().then((res) => {
      setAllUserIds(res);
    });
  }, []);

  if (!allUserIds) return <div></div>;

  return (
    <PageViewer
      pageSize={pageSize}
      total={allUserIds.length}
      renderContent={async (page) => {
        // 当前显示的id
        const showIds = allUserIds.slice(
          (page - 1) * pageSize,
          page * pageSize,
        );
        const userList = await getPixivUserList(showIds);
        // 加载当页用户最近小说
        const userNovelsSet: { [userId: string]: INovelProfile[] } = {};
        const allNovelIds = userList
          .map((user) => {
            userNovelsSet[user.id] = [];
            // 取最后几本书，取完后再倒序
            return user.novels.slice(-NovelNumber).reverse();
          })
          .flat();

        const allNovelSet: { [novelId: string]: INovelProfile } = {};
        // 一次请求所有小说，然后放入集合，再索引

        (await getPixivNovelProfiles(allNovelIds)).forEach((novelProfile) => {
          userNovelsSet[novelProfile.userId].push(novelProfile);
        });
        return (
          <div className="px-4 py-2">
            {userList.map((user) => (
              <UserCard
                key={user.id}
                userInfo={user}
                novelInfoList={userNovelsSet[user.id]}
              />
            ))}
          </div>
        );
      }}
    />
  );
}
