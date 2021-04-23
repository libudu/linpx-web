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
  length,
  createDate,
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
        <div className="text-xs font-bold">
          {userName}
          <span className="inline-block ml-2 font-normal text-gray-400">
            {length}字
          </span>
          <span className="inline-block ml-2 font-normal text-gray-400">
            {new Date(createDate).toLocaleDateString()}
          </span>
        </div>
        <div className="text-xs text-blue-400 u-line-1">
          {tags.map((tag) => (
            <span key={tag}>#{tag} </span>
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
