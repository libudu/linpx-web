import { useState, useEffect } from 'react';
import { history } from 'umi';
import PageViewer from '@/components/PageViewer';

import {
  getPixivNovelProfiles,
  getPixivUserList,
  getRecommendPixivAuthors,
  INovelProfile,
  IUserInfo,
} from '@/utils/api';

const pageSize = 6;

function NovelCard({ coverUrl, title, id }: INovelProfile) {
  return (
    <div
      className="lp-shadow mx-2 text-sm w-20 flex-grow-0 flex-shrink-0 overflow-hidden flex flex-col"
      onClick={() => id && history.push(`/pixiv/novel/${id}`)}
    >
      {coverUrl ? (
        <div className="h-20 w-full overflow-hidden flex items-center">
          <img className="w-full" src={coverUrl} loading="lazy" />
        </div>
      ) : (
        <div className="h-20 w-full bg-gray-200" />
      )}
      <div className="u-line-2 m-1 text-center font-bold text-xs whitespace-pre-line flex-grow">
        {title || '\n\n'}
      </div>
    </div>
  );
}

interface IUserCard {
  userInfo: IUserInfo;
  novelInfoList: INovelProfile[];
}

function UserCard({ userInfo, novelInfoList }: IUserCard) {
  const { name, imageUrl, id } = userInfo;
  if (novelInfoList.length < NovelNumber) {
    novelInfoList = novelInfoList.concat(
      Array(NovelNumber - novelInfoList.length).fill({}),
    );
  }

  return (
    <div className="my-3 p-2 lp-shadow lp-bgcolor flex overflow-x-scroll">
      <div
        className="mt-1 flex flex-col items-center flex-grow"
        onClick={() => history.push(`/pixiv/user/${id}`)}
      >
        <div
          className="rounded-full bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
            width: '4.7rem',
            height: '4.7rem',
          }}
        />
        <div
          className="py-1 w-24 text-center text-base font-bold u-line-2"
          style={{ lineHeight: '1.1rem' }}
        >
          {name}
        </div>
      </div>
      <div className="pr-1 flex">
        {novelInfoList.slice(0, NovelNumber).map((ele, index) => (
          <NovelCard key={ele?.id || index} {...ele} />
        ))}
      </div>
    </div>
  );
}

const NovelNumber = 5;

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
        const allNovelIds = userList
          .map((user) => user.novels.slice(0, NovelNumber))
          .flat();
        const allNovelSet: { [novelId: string]: INovelProfile } = {};
        // 一次请求所有小说，然后放入集合，再索引
        (await getPixivNovelProfiles(allNovelIds)).forEach((novelProfile) => {
          allNovelSet[novelProfile.id] = novelProfile;
        });
        return (
          <div className="px-4 py-2">
            {userList.map((user) => (
              <UserCard
                key={user.id}
                userInfo={user}
                novelInfoList={user.novels.map(
                  (novelId) => allNovelSet[novelId],
                )}
              />
            ))}
          </div>
        );
      }}
    />
  );
}
