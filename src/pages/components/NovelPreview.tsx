import { history } from 'umi';
import { INovelProfile } from '@/types';
import InteractImg from '@/assets/icon/interact.png';
import { checkLinpxNovel } from '../pixiv/novel/[id]/util';

export default function NovelPreview({
  coverUrl,
  title,
  id,
  userName,
  desc,
}: INovelProfile) {
  const isLinpxNovel = checkLinpxNovel({ desc });
  return (
    <div
      className="lp-shadow h-full text-sm flex-grow-0 flex-shrink-0 overflow-hidden flex flex-col"
      style={{ width: '6.5rem', wordBreak: 'keep-all' }}
      onClick={() => id && history.push(`/pixiv/novel/${id}`)}
    >
      {coverUrl ? (
        <div className="h-24 w-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={coverUrl}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-24 w-full bg-gray-200" />
      )}
      <div className="flex flex-col justify-center flex-grow">
        <div className="u-line-2 m-1 mb-0 text-center font-black text-sm whitespace-pre-line">
          {isLinpxNovel && (
            <img className="w-3.5 mb-0.5 mr-0.5" src={InteractImg} />
          )}
          {title}
        </div>
        <div className="u-line-1 m-1 mt-0 text-center text-xs whitespace-pre-line">
          {userName}
        </div>
      </div>
    </div>
  );
}
