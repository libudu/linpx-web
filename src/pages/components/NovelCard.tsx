import { INovelProfile } from '@/utils/api';
import { history } from 'umi';

// 最近小说页面
// 作者详情页面
export default function NovelCard({
  id,
  title,
  userName,
  desc,
  coverUrl,
  tags,
}: INovelProfile) {
  return (
    <div
      className="lp-shadow my-5 flex lp-bgcolor overflow-hidden w-full"
      onClick={() => history.push(`/pixiv/novel/${id}`)}
    >
      <div className="lp-shadow w-20 h-28 m-3 overflow-hidden flex-shrink-0 flex items-center justify-center">
        <img className="h-full" src={coverUrl} loading="lazy" />
      </div>
      <div className="text-left flex flex-col mt-2 mr-2 flex-shrink">
        <div className="font-bold u-line-1">{title}</div>
        <div className="text-xs font-bold">{userName}</div>
        <div className="text-xs text-blue-400 u-line-1">
          {tags.map((tag) => (
            <span>#{tag} </span>
          ))}
        </div>
        <div
          className="text-sm u-line-3 overflow-hidden"
          style={{ pointerEvents: 'none' }}
          dangerouslySetInnerHTML={{ __html: desc }}
        />
      </div>
    </div>
  );
}
