import { usePixivNovelProfiles, usePixivUserList } from '@/utils/api';
import { INovelProfile, IMap } from '@/types';
import PageViewer from './PageViewer';
import UserCard, { NovelNumber } from './UserCard';

export function RenderUserCards({ userIdList }: { userIdList: string[] }) {
  const userList = usePixivUserList(userIdList);
  const userNovelsMap: IMap<INovelProfile[]> = {};
  const allNovelIds = userList
    .map((user) => {
      userNovelsMap[user.id] = [];
      // 取最后几本书，取完后再倒序
      return user.novels.slice(-NovelNumber).reverse();
    })
    .flat();

  const novelProfiles = usePixivNovelProfiles(allNovelIds);
  novelProfiles.forEach((novelProfile) =>
    userNovelsMap[novelProfile.userId].push(novelProfile),
  );

  return (
    <>
      {userList.map((user) => (
        <UserCard
          key={user.id}
          userInfo={user}
          novelInfoList={userNovelsMap[user.id]}
        />
      ))}
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
  return (
    <PageViewer
      pageSize={pageSize}
      total={userIdList.length}
      renderContent={async (page) => {
        // 当前显示的id
        const userIds = userIdList.slice(
          (page - 1) * pageSize,
          page * pageSize,
        );
        return <RenderUserCards userIdList={userIds} />;
      }}
    />
  );
}
