import NovelCardList from '@/components/NovelCardList';
import PageLayout from '@/components/PageLayout';
import UserCardList from '@/components/UserCardList';
import { useAnalyseTag, useSearchFavUser } from '@/api';
import { useEffect } from 'react';
import { history } from 'umi';
import { ISearch } from './index';

function SearchLinpxUsers({ word }: ISearch) {
  const idList = useSearchFavUser(word);
  return <UserCardList userIdList={idList} />;
}

function SearchLinpxNovels({ word }: ISearch) {
  const analyseTag = useAnalyseTag();
  const matchTag = analyseTag?.data.find((tag) => tag.tagName === word);
  const idList = matchTag?.novels || [];
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
        {type === 'novel' && <SearchLinpxNovels word={word} />}
        {type === 'user' && <SearchLinpxUsers word={word} />}
      </div>
    </PageLayout>
  );
}
