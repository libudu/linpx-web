import NovelCardList from '@/components/NovelCardList';
import PageLayout from '@/components/PageLayout';
import UserCardList from '@/components/UserCardList';
import { getFavUserInfo, getFavUserTagInfo } from '@/utils/api';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { ISearch } from './index';

function LinpxUsers({ word }: ISearch) {
  const [idList, setIdList] = useState<string[]>();

  useEffect(() => {
    getFavUserInfo().then(async (res) => {
      const idList = Object.entries(res)
        .filter(([userName, _]) => userName.includes(word))
        .map(([_, userId]) => userId);
      if (idList.length === 0) return;
      setIdList(idList);
    });
  }, [word]);

  if (!idList) return <></>;

  return <UserCardList userIdList={idList} />;
}

function LinpxNovels({ word }: ISearch) {
  const [idList, setIdList] = useState<string[]>();

  useEffect(() => {
    const favUser = getFavUserTagInfo();
    const matchTag = favUser.data.find((tag) => tag.tagName === word);
    if (!matchTag) return;
    setIdList(matchTag.novels);
  }, [word]);

  if (!idList) return <></>;

  return <NovelCardList novelIdList={idList} />;
}

export default function SearchLinpx() {
  const { word, type }: { word: string; type: 'novel' | 'user' } = history
    .location.query as any;

  useEffect(() => {
    if (!word || (type !== 'novel' && type !== 'user')) {
      history.replace('/404');
      return;
    }
  });

  let title = '';
  if (type === 'novel') title = `站内小说 - ${word}`;
  if (type === 'user') title = `推荐作者 - ${word}`;

  return (
    <PageLayout title={title}>
      <div className="mx-4">
        {type === 'novel' && <LinpxNovels word={word} />}
        {type === 'user' && <LinpxUsers word={word} />}
      </div>
    </PageLayout>
  );
}
