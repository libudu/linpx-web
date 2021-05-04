import { useState, useEffect } from 'react';

import { getRecommendPixivAuthors } from '@/utils/api';
import UserCardList from '@/components/UserCardList';

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
    <div className="px-4 py-2">
      <UserCardList userIdList={allUserIds} />
    </div>
  );
}
