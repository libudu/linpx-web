import {
  getPixivUserList,
  INovelProfile,
  getPixivNovelProfiles,
} from '@/utils/api';
import PageViewer from './PageViewer';
import UserCard, { NovelNumber } from './UserCard';

export async function renderUserCards(userIdList: string[]) {
  const userList = await getPixivUserList(userIdList);
  if (userList.length === 0) return null;
  // 加载当页用户最近小说
  const userNovelsMap: { [userId: string]: INovelProfile[] } = {};
  const allNovelIds = userList
    .map((user) => {
      userNovelsMap[user.id] = [];
      // 取最后几本书，取完后再倒序
      return user.novels.slice(-NovelNumber).reverse();
    })
    .flat();
  // 一次请求所有小说，然后放入集合，再索引
  (await getPixivNovelProfiles(allNovelIds)).forEach((novelProfile) => {
    userNovelsMap[novelProfile.userId].push(novelProfile);
  });
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
        return await renderUserCards(userIds);
      }}
    />
  );
}
