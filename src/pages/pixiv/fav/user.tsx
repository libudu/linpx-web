import { useFavUserIds } from '@/utils/api';
import UserCardList from '@/components/UserCardList';

export default function () {
  document.title = 'Linpx - 推荐作者';
  // 推荐作者的id
  const favUserIds = useFavUserIds() || [];

  return (
    <div className="px-4 py-2">
      <UserCardList userIdList={favUserIds} />
    </div>
  );
}
