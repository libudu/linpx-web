import { useState, useEffect, useRef } from 'react';
import { history } from 'umi';
import { Pagination } from 'antd';

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
      className="lp-shadow mx-2 text-sm w-20 flex-grow-0 flex-shrink-0 overflow-hidden"
      onClick={() => id && history.push(`/pixiv/novel/${id}`)}
    >
      {coverUrl ? (
        <div className="h-20 w-full overflow-hidden flex items-center">
          <img className="w-full" src={coverUrl} loading="lazy" />
        </div>
      ) : (
        <div className="h-20 w-full bg-gray-200" />
      )}
      <div className="u-line-2 m-1 text-center font-bold text-xs">{title}</div>
    </div>
  );
}

interface IUserCard {
  userInfo: IUserInfo;
  novelsInfo: INovelProfile[];
}

function UserCard({ userInfo, novelsInfo }: IUserCard) {
  const { name, imageUrl, id } = userInfo;

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
      <div className="px-1 flex">
        {novelsInfo.slice(0, NovelNumber).map((ele) => (
          <NovelCard {...ele} />
        ))}
      </div>
    </div>
  );
}

const NovelNumber = 5;

export default function () {
  document.title = 'Linpx - 推荐作者';
  const scrollRef = useRef<HTMLDivElement>(null);
  // 当前页数
  const [page, setPage] = useState<number>(
    Number(history.location?.query?.page) || 1,
  );
  // 推荐作者的id
  const [allUserIds, setAllUserIds] = useState<string[]>([]);
  // 推荐作者的信息
  const [users, setUsers] = useState<IUserInfo[]>([]);
  // 本页小说信息
  const [novels, setNovels] = useState<{ [id: string]: INovelProfile }>({});

  useEffect(() => {
    getRecommendPixivAuthors().then((res) => {
      setAllUserIds(res);
      // 当前页码数小于1或大于最大时，需要修正
      const total = res.length;
      const maxPage = Math.ceil(total / pageSize);
      const truePage = Math.min(Math.max(page, 1), maxPage);
      setPage(truePage);
      // 当前显示的id
      const showIds = res.slice((truePage - 1) * pageSize, truePage * pageSize);
      getPixivUserList(showIds).then((usersInfo) => {
        // 加载用户基本信息
        setUsers(usersInfo);
        // 加载当页用户最近小说
        const novels = usersInfo
          .map((user) => user.novels.slice().reverse().slice(0, NovelNumber))
          .flat();
        getPixivNovelProfiles(novels).then((novelsInfo) => {
          const tempNovels: { [id: string]: INovelProfile } = {};
          novelsInfo.forEach((novels) => {
            tempNovels[novels.id] = novels;
          });
          setNovels(tempNovels);
        });
      });
    });
  }, [page]);

  return (
    <div className="h-full overflow-scroll" ref={scrollRef}>
      <div className="m-6">
        {users.map((ele) => {
          const novelIds = ele.novels.slice().reverse().slice(0, NovelNumber);
          const novelsInfo: INovelProfile[] = [];
          for (let i = 0; i < NovelNumber; i++) {
            novelsInfo.push(novels[novelIds[i]]);
          }
          return (
            <div key={ele.id}>
              <UserCard userInfo={ele} novelsInfo={novelsInfo} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-center my-6">
        <Pagination
          pageSize={pageSize}
          current={page}
          total={allUserIds.length}
          onChange={(page) => {
            setPage(page);
            history.push(history.location.pathname + `?page=${page}`);
            scrollRef.current?.scrollTo(0, 0);
          }}
        />
      </div>
    </div>
  );
}
