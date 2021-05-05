import NovelCard from '@/components/NovelCard';
import PageLayout from '@/components/PageLayout';
import PageViewer from '@/components/PageViewer';
import UserCard from '@/components/UserCard';
import { searchNovel, searchUser } from '@/utils/api';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { ISearch } from './index';

function SearchPixivNovels({ word }: ISearch) {
  const pageSize = 24;

  const [total, setTotal] = useState<number>();

  useEffect(() => {
    searchNovel(word).then(({ total }) => setTotal(total));
  }, [word]);

  if (!total) return <></>;

  return (
    <PageViewer
      total={total}
      pageSize={pageSize}
      renderContent={async (page) => {
        const { novels } = await searchNovel(word, page);
        return novels.map((novel) => <NovelCard key={novel.id} {...novel} />);
      }}
    />
  );
}

function SearchPixivUsers({ word }: ISearch) {
  const PageSize = 6;

  const [total, setTotal] = useState<number>();

  useEffect(() => {
    searchUser(word).then(({ total }) => setTotal(total));
  }, [word]);

  if (!total) return <></>;

  return (
    <PageViewer
      total={total}
      pageSize={PageSize}
      renderContent={async (page) => {
        const { users } = await searchUser(word, page);
        return users.map((user) => (
          <UserCard key={user.id} userInfo={user} novelInfoList={user.novels} />
        ));
      }}
    />
  );
}

export default function SearchPixiv() {
  const { word, type }: { word: string; type: 'novel' | 'user' } = history
    .location.query as any;

  useEffect(() => {
    if (!word || (type !== 'novel' && type !== 'user')) {
      history.replace('/404');
      return;
    }
  });

  let title = '';
  if (type === 'novel') title = `全部小说 - ${word}`;
  if (type === 'user') title = `全部用户 - ${word}`;

  return (
    <PageLayout title={title}>
      <div className="mx-4">
        {type === 'novel' && <SearchPixivNovels word={word} />}
        {type === 'user' && <SearchPixivUsers word={word} />}
      </div>
    </PageLayout>
  );
}
