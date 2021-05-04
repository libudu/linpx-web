import {
  getPixivUserList,
  INovelProfile,
  getPixivNovelProfiles,
} from '@/utils/api';
import PageViewer from './PageViewer';
import UserCard, { NovelNumber } from './UserCard';

interface IUserCardList {
  pageSize?: number;
  userIdList: string[];
}

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
        const showIds = userIdList.slice(
          (page - 1) * pageSize,
          page * pageSize,
        );
        const userList = await getPixivUserList(showIds);
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
          <div className="px-4 py-2">
            {userList.map((user) => (
              <UserCard
                key={user.id}
                userInfo={user}
                novelInfoList={userNovelsMap[user.id]}
              />
            ))}
          </div>
        );
      }}
    />
  );
}
