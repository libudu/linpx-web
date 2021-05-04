import { history } from 'umi';
import SearchBar from '@/components/SearchBar';
import { useEffect, useState } from 'react';
import { transformLink } from '../../components/TransLink';
import {
  getFavUserTagInfo,
  getPixivNovelProfiles,
  getPixivUser,
  INovelProfile,
  IUserInfo,
  searchNovel,
  ISearchNovel,
  searchUser,
  ISearchUser,
  getFavUserInfo,
} from '@/utils/api';
import NovelCard from '@/components/NovelCard';
import UserCard from '@/components/UserCard';
import { renderUserCards } from '@/components/UserCardList';

interface ISearch {
  word: string;
}

const isId = (word: string) => String(Number(word)) !== 'NaN';

const extractLinpxLink = (word: string) => {
  try {
    const urlObj = new URL(word);
    if (
      urlObj.host === 'linpx.linpicio.com' ||
      urlObj.host === 'furrynovel.xyz'
    ) {
      return urlObj.pathname;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

function SearchTitle({ children }: { children: any }) {
  return <div className="text-2xl font-bold">{children}</div>;
}

// 搜索小说id
function SearchNovelById({ word }: ISearch) {
  const [novel, setNovel] = useState<INovelProfile>();

  useEffect(() => {
    setNovel(undefined);
    getPixivNovelProfiles([word]).then((res) => {
      if (res[0]) setNovel(res[0]);
    });
  }, [word]);

  if (!novel) return <></>;

  return (
    <>
      <SearchTitle>该id小说：</SearchTitle>
      <NovelCard {...novel} />
    </>
  );
}

// 搜索作者id
function SearchUserById({ word }: ISearch) {
  const [user, setUser] = useState<IUserInfo>();
  const [userNovels, setUserNovels] = useState<INovelProfile[]>();

  useEffect(() => {
    setUser(undefined);
    getPixivUser(word).then((res) => {
      // @ts-ignore
      if (res?.error) return;
      setUser(res);
      const novels = res.novels;
      getPixivNovelProfiles(novels).then((res) => {
        setUserNovels(res);
      });
    });
  }, [word]);

  if (!user || !userNovels) return <></>;

  return (
    <>
      <SearchTitle>该id作者：</SearchTitle>
      <UserCard userInfo={user} novelInfoList={userNovels} />
    </>
  );
}

// 推荐作者某标签下的小说
function FavUserTagNovels({ word }: ISearch) {
  const MaxPreviewNovel = 3;

  const [total, setTotal] = useState<number>();
  const [novels, setNovels] = useState<INovelProfile[]>();

  useEffect(() => {
    setNovels(undefined);
    const favUser = getFavUserTagInfo();
    const matchTag = favUser.data.find((tag) => tag.tagName === word);
    if (matchTag) {
      setTotal(matchTag.novels.length);
      const novelIds = matchTag.novels.slice(0, MaxPreviewNovel);
      getPixivNovelProfiles(novelIds).then((res) => {
        setNovels(res);
      });
    }
  }, [word]);

  if (!novels) return <></>;

  return (
    <>
      <SearchTitle>站内小说 共{total}篇</SearchTitle>
      {novels.map((novel) => (
        <NovelCard key={novel.id} {...novel} />
      ))}
    </>
  );
}

// 推荐作者
function FavUsers({ word }: ISearch) {
  const MaxPreviewUser = 3;

  const [total, setTotal] = useState<ISearchUser['total']>();
  const [userELe, setUserEle] = useState<any>();

  useEffect(() => {
    setUserEle(undefined);
    getFavUserInfo().then(async (res) => {
      const idList = Object.entries(res)
        .filter(([userName, _]) => userName.includes(word))
        .map(([_, userId]) => userId);
      if (idList.length === 0) return;
      setTotal(idList.length);
      setUserEle(await renderUserCards(idList.slice(0, MaxPreviewUser)));
    });
  }, [word]);

  if (!userELe) return <></>;

  return (
    <>
      <SearchTitle>推荐作者 共{total}位</SearchTitle>
      {userELe}
    </>
  );
}

// 搜索pixiv作者
function PixivUser({ word }: ISearch) {
  const MaxPreviewUser = 3;

  const [total, setTotal] = useState<ISearchUser['total']>();
  const [users, setUsers] = useState<ISearchUser['users']>();

  useEffect(() => {
    setUsers(undefined);
    searchUser(word).then((res) => {
      if (res.total === 0) return;
      setTotal(res.total);
      setUsers(res.users);
    });
  }, [word]);

  if (!users) return <></>;

  return (
    <>
      <SearchTitle>全部用户 共{total}位</SearchTitle>
      {users.slice(0, MaxPreviewUser).map((user) => (
        <UserCard key={user.id} userInfo={user} novelInfoList={user.novels} />
      ))}
    </>
  );
}

// 搜索pixiv小说
function PixivNovel({ word }: ISearch) {
  const MaxPreviewUser = 3;

  const [total, setTotal] = useState<ISearchNovel['total']>();
  const [novels, setNovels] = useState<ISearchNovel['novels']>();

  useEffect(() => {
    setNovels(undefined);
    searchNovel(word).then((res) => {
      if (res.total === 0) return;
      setTotal(res.total);
      setNovels(res.novels);
    });
  }, [word]);

  if (!novels) return <></>;

  return (
    <>
      <SearchTitle>全部小说 共{total}篇</SearchTitle>
      {novels.slice(0, MaxPreviewUser).map((novel) => (
        <NovelCard key={novel.id} {...novel} />
      ))}
    </>
  );
}

export default function Search() {
  const [word, setWord] = useState(String(history.location.query?.word || ''));
  const [search, setSearch] = useState(false);

  useEffect(() => {
    // 搜索字符为空，不搜索
    if (!word) {
      setSearch(false);
      return;
    }
    // 如果是linpx链接，直接跳转
    const linpxPath = extractLinpxLink(word);
    if (linpxPath) {
      history.replace('/pixiv/search');
      history.push(linpxPath);
      return;
    }
    // 如果是pixiv链接，转为linpx链接，然后跳转
    const link = transformLink(word);
    if (link) {
      const { pathname } = new URL(link);
      history.replace('/pixiv/search');
      history.push(pathname);
      return;
    }
    // 不是链接，开始搜索
    setSearch(true);
    return;
  }, [word]);

  return (
    <div className="mx-4">
      <SearchBar
        initWord={word}
        onSearch={(newWord) => {
          history.replace(`/pixiv/search?word=${newWord}`);
          setWord(newWord);
        }}
      />
      <div>当前搜索：{word}</div>
      {
        // word非空才搜索
        search &&
          (isId(word) ? (
            // 纯数字，搜索id
            <>
              <SearchUserById word={word} />
              <SearchNovelById word={word} />
            </>
          ) : (
            // 非数字，搜索推荐tag、pixiv作者、pixiv小说
            <>
              <FavUsers word={word} />
              <FavUserTagNovels word={word} />
              <PixivUser word={word} />
              <PixivNovel word={word} />
            </>
          ))
      }
    </div>
  );
}
