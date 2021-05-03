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

const isLinpxLink = (word: string) => {
  // 支持linpicio和furrynovel两个域名
  const reg = /http(s?):\/\/(linpx.linpicio.com|furrynovel.xyz)/;
  // 避免循环定向，如果定位到自己则不重定向
  if (reg.test(word) && !word.includes('/pixiv/search')) {
    return true;
  }
  return false;
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
    if (isLinpxLink(word)) {
      window.open(word, '_self');
      return;
    }
    // 如果是pixiv链接，转为linpx链接，然后跳转
    const link = transformLink(word);
    if (link) {
      window.open(link, '_self');
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
      <div>当前搜索：{word}</div>
      {novel && <NovelCard {...novel} />}
      {user && userNovels && (
        <UserCard userInfo={user} novelInfoList={userNovels} />
      )}
    </div>
  );
}
