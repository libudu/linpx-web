import { history } from 'umi';
import { IPost, usePixivNovelProfiles } from '@/api';
import { Array2Map } from '@/types';
import NameTime from './NameTime';
import NovelRefer from './NovelRefer';

// 普通帖子
const PostPreview: React.FC<{
  postList: IPost[];
  timeType: 'post' | 'comment';
}> = ({ postList, timeType }) => {
  const referList = postList
    .map(({ refer }) => refer)
    .filter((refer) => refer && refer.type && refer.data);
  const referNovelList = referList
    .filter((refer) => refer?.type == 'novel')
    .map((refer) => refer?.data) as string[];
  const novelInfo = usePixivNovelProfiles(referNovelList);
  const novelInfoMap = novelInfo ? Array2Map(novelInfo) : {};
  return (
    <>
      {postList.map(
        ({
          ip,
          title,
          content,
          _time,
          id,
          commentCount,
          refer,
          createTime,
          tags,
        }) => {
          let referElement = null;
          // 引用小说
          if (refer?.type == 'novel' && refer.data) {
            const novelInfo = novelInfoMap[refer.data];
            if (novelInfo) {
              referElement = <NovelRefer {...novelInfo} />;
            }
          }
          return (
            <div
              key={id}
              className="px-4 py-2 hover:bg-gray-100 transition-all cursor-pointer"
              style={{ borderBottom: '1px solid #ddd' }}
              onClick={() => {
                history.push('/post/' + id);
              }}
            >
              <NameTime
                ip={ip}
                _time={timeType == 'post' ? createTime : _time}
                rightEle={'回复: ' + commentCount}
              />
              <div className="u-line-1 text-xl font-bold mt-0.5">
                {tags?.length > 0 && (
                  <span className="text-yellow-500 mr-2">
                    #{tags.join(' #')}
                  </span>
                )}
                {title}
              </div>
              <div className="u-line-2 text-base">{content}</div>
              {referElement && <div className="mt-1">{referElement}</div>}
            </div>
          );
        },
      )}
    </>
  );
};

export default PostPreview;
