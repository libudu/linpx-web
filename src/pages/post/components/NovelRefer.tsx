import { usePixivNovelProfiles } from '@/api';
import { INovelProfile } from '@/types';
import { history } from 'umi';

export const NovelReferById: React.FC<{ id: string }> = ({ id }) => {
  const novelProfile = usePixivNovelProfiles([id])?.[0];
  if (!novelProfile) return <></>;
  return <NovelRefer {...novelProfile} />;
};

const NovelRefer: React.FC<INovelProfile> = ({
  id,
  coverUrl,
  title,
  userName,
  createDate,
  tags,
  length,
}) => {
  return (
    <div
      className="rounded-md overflow-hidden flex lp-bgcolor mt-2 mx-4 p-1.5"
      style={{ border: '1px solid #ddd', boxShadow: '0 0 4px #aaa' }}
      onClick={(e) => {
        e.stopPropagation();
        history.push(`/pixiv/novel/${id}`);
      }}
    >
      <img
        className="object-cover rounded-sm"
        style={{ width: 50, height: 70, boxShadow: '0 0 4px #888' }}
        src={coverUrl}
      />
      <div
        className="h-full px-2 flex flex-col justify-around flex-grow pb-1"
        style={{ height: 70 }}
      >
        <div className="font-black u-line-1">{title}</div>
        <div className="text-xs">
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
      </div>
    </div>
  );
};

export default NovelRefer;
