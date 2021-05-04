import { history } from 'umi';
import SearchBar from '@/components/SearchBar';
import { useEffect, useState } from 'react';
import { transformLink } from '../components/TransLink';
import {
  getPixivNovelProfiles,
  getPixivUser,
  INovelProfile,
  IUserInfo,
} from '@/utils/api';
import NovelCard from '@/components/NovelCard';
import UserCard from '@/components/UserCard';

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

export default function Search() {
  const [word, setWord] = useState(String(history.location.query?.word || ''));

  const [user, setUser] = useState<IUserInfo>();
  const [userNovels, setUserNovels] = useState<INovelProfile[]>();
  const [novel, setNovel] = useState<INovelProfile>();

  useEffect(() => {
    setUser(undefined);
    setNovel(undefined);
    if (!word) return;
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
    // 是否是id，是的话搜索小说id和作者id
    if (isId(word)) {
      getPixivUser(word).then((res) => {
        // @ts-ignore
        if (res?.error) return;
        setUser(res);
        const novels = res.novels;
        getPixivNovelProfiles(novels).then((res) => {
          setUserNovels(res);
        });
      });
      getPixivNovelProfiles([word]).then((res) => {
        if (res[0]) setNovel(res[0]);
      });
    }
    // 是否是推荐作者tag
    // pixiv全站搜作者
    // pixiv全站搜小说
    // pixiv全站搜tag
  }, [word]);
  return (
    <div className="mx-4">
      <SearchBar initWord={word} onSearch={(newWord) => setWord(newWord)} />
      <div>搜索页面还没做完，当前仅支持链接搜索和id搜索</div>
      <div>当前搜索：{word}</div>
      {novel && <NovelCard {...novel} />}
      {user && userNovels && (
        <UserCard userInfo={user} novelInfoList={userNovels} />
      )}
    </div>
  );
}
