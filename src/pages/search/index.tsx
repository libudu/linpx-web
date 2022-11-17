import { history } from 'umi';
import SearchBar from '@/components/SearchBar';
import { useEffect, useState } from 'react';
import { transformLink } from '../components/TransLink';
import {
  useSearchFavUser,
  usePixivSearchNovel,
  useAnalyseTag,
  usePixivSearchUser,
} from '@/api';
import NovelCard from '@/components/NovelCard';
import UserCard from '@/components/UserCard';
import { RenderUserCards } from '@/components/UserCardList';
import { RenderNovelCards } from '@/components/NovelCardList';

export interface ISearch {
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

function SearchTitle({
  children,
  clickMorePath,
}: {
  children: any;
  clickMorePath?: string;
}) {
  return (
    <div className="mt-5 flex items-end">
      <div className="text-2xl font-black">{children}</div>
      {clickMorePath && (
        <div className="text-base text-right pr-2 flex-grow">
          <span
            style={{ borderBottom: '1px solid black' }}
            onClick={() => {
              history.push(clickMorePath);
            }}
          >
            查看全部
          </span>
        </div>
      )}
    </div>
  );
}

interface ISearchBase {
  title: string;
  clickMorePath?: string;
  children: React.ReactNode;
}

// 抽象公共逻辑
// 搜索页各个搜索项都包括标题、渲染元素、新渲染清空、空结果不渲染等逻辑
function SearchBase({ children, title, clickMorePath }: ISearchBase) {
  return (
    <>
      <SearchTitle clickMorePath={clickMorePath}>{title}</SearchTitle>
      {children}
    </>
  );
}

// 搜索小说id
function SearchNovelById({ word }: ISearch) {
  return (
    <SearchBase title="该id小说：">
      <RenderNovelCards novelIdList={[word]} />
    </SearchBase>
  );
}

// 搜索作者id
function SearchUserById({ word }: ISearch) {
  return (
    <SearchBase title="该id作者：">
      <RenderUserCards userIdList={[word]} />
    </SearchBase>
  );
}

// 推荐作者某标签下的小说
function FavUserTagNovels({ word }: ISearch) {
  const MaxPreviewNovel = 3;

  const analyseTag = useAnalyseTag();
  const matchTag = analyseTag?.data.find((tag) => tag.tagName === word);

  if (!matchTag) return <></>;

  const total = matchTag.novels.length;
  if (total === 0) return <></>;
  const novelIds = matchTag.novels.slice(0, MaxPreviewNovel);
  return (
    <SearchBase
      title={`站内小说 共${total}篇`}
      clickMorePath={
        total && total > MaxPreviewNovel
          ? `/search/linpx?word=${word}&type=novel`
          : ''
      }
    >
      <RenderNovelCards novelIdList={novelIds} />
    </SearchBase>
  );
}

// 推荐作者
function FavUsers({ word }: ISearch) {
  const MaxPreviewUser = 3;

  const idList = useSearchFavUser(word);
  const total = idList.length;
  if (total === 0) return <></>;

  return (
    <SearchBase
      title={`推荐作者 共${total}位`}
      clickMorePath={
        total && total > MaxPreviewUser
          ? `/search/linpx?word=${word}&type=user`
          : ''
      }
    >
      <RenderUserCards userIdList={idList.slice(0, MaxPreviewUser)} />
    </SearchBase>
  );
}

// 搜索pixiv作者
function PixivUser({ word }: ISearch) {
  const isCache = location.pathname.endsWith('/cache');
  const MaxPreviewUser = 3;

  const data = usePixivSearchUser(word, 1, isCache);
  if (!data) return <></>;

  const { total, users } = data;
  if (total === 0) return <></>;

  return (
    <SearchBase
      title={`${isCache ? '缓存用户' : '全部用户'}  共${total}位`}
      clickMorePath={
        total && total > MaxPreviewUser
          ? `/search/pixiv?word=${word}&type=user`
          : ''
      }
    >
      {users.slice(0, MaxPreviewUser).map((user) => (
        <UserCard key={user.id} userInfo={user} novelInfoList={user.novels} />
      ))}
    </SearchBase>
  );
}

// 搜索pixiv小说
function PixivNovel({ word }: ISearch) {
  const MaxPreview = 3;

  const data = usePixivSearchNovel(word);
  if (!data) return <></>;

  const { total, novels } = data;
  if (total === 0) return <></>;

  return (
    <SearchBase
      title={`全部小说 共${total}篇`}
      clickMorePath={
        total && total > MaxPreview
          ? `/search/pixiv?word=${word}&type=novel`
          : ''
      }
    >
      {novels.slice(0, MaxPreview).map((novel) => (
        <NovelCard key={novel.id} {...novel} />
      ))}
    </SearchBase>
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
      history.replace('/search');
      history.push(linpxPath);
      return;
    }
    // 如果是pixiv链接，转为linpx链接，然后跳转
    const link = transformLink(word);
    if (link) {
      const { pathname } = new URL(link);
      history.replace('/search');
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
          if (newWord === word) return;
          history.replace(`/search?word=${newWord}`);
          setWord(newWord);
        }}
      />
      <div className="mt-2">当前搜索：{word}</div>
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
