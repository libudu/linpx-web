import { usePixivNovelProfiles, usePixivUserList } from '@/api';
import { INovelProfile, IMap } from '@/types';
import PageViewer from './PageViewer';
import UserCard, { NovelNumber } from './UserCard';
import { useState } from 'react';
import UserCardSkeleton from '@/skeleton/UserCardSkeleton';

export function RenderUserCards({ userIdList }: { userIdList: string[] }) {
  const userList = usePixivUserList(userIdList);
  const userNovelsMap: IMap<INovelProfile[]> = {};
  const allNovelIds =
    userList
      ?.map((user) => {
        userNovelsMap[user.id] = [];
        // 取最后几本书，取完后再倒序
        return user.novels.slice(-NovelNumber).reverse();
      })
      .flat() || [];

  const novelProfiles = usePixivNovelProfiles(allNovelIds);
  novelProfiles?.forEach((novelProfile) =>
    userNovelsMap[novelProfile.userId].push(novelProfile),
  );

  return (
    <>
      {userList ? (
        userList?.map((user) => (
          <UserCard
            key={user.id}
            userInfo={user}
            novelInfoList={userNovelsMap[user.id]}
          />
        ))
      ) : (
        <UserCardSkeleton number={userIdList.length} />
      )}
    </>
  );
}

interface IUserCardList {
  pageSize?: number;
  userIdList: string[];
}

// 带分页器的用户卡片列表
export default function UserCardList({
  pageSize = 6,
  userIdList,
}: IUserCardList) {
  const [page, setPage] = useState<number>(1);

  const userIds = userIdList.slice((page - 1) * pageSize, page * pageSize);

  return (
    <PageViewer
      pageSize={pageSize}
      total={userIdList.length}
      onPageChange={setPage}
    >
      <RenderUserCards userIdList={userIds} />
    </PageViewer>
  );
}
