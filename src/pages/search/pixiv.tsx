import NovelCard from '@/components/NovelCard';
import PageLayout from '@/components/PageLayout';
import PageViewer from '@/components/PageViewer';
import UserCard from '@/components/UserCard';
import NovelCardSkeleton from '@/skeleton/NovelCardSkeleton';
import { usePixivSearchNovel, usePixivSearchUser } from '@/utils/api';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { ISearch } from './index';

function SearchPixivNovels({ word }: ISearch) {
  const pageSize = 24;

  const [page, setPage] = useState<number>();
  const data = usePixivSearchNovel(word, page);

  if (!data) return <NovelCardSkeleton number={pageSize} />;

  const { total, novels } = data;

  return (
    <PageViewer pageSize={pageSize} total={total} onPageChange={setPage}>
      {novels.map((novel) => (
        <NovelCard key={novel.id} {...novel} />
      ))}
    </PageViewer>
  );
}

function SearchPixivUsers({ word }: ISearch) {
  const pageSize = 6;

  const [page, setPage] = useState<number>();
  const data = usePixivSearchUser(word, page);

  if (!data) return <></>;

  const { total, users } = data;

  return (
    <PageViewer pageSize={pageSize} total={total} onPageChange={setPage}>
      {users.map((user) => (
        <UserCard key={user.id} userInfo={user} novelInfoList={user.novels} />
      ))}
    </PageViewer>
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
