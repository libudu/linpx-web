import { getPixivNovelComments } from '@/api';
import PageLayout from '@/components/PageLayout';
import { INovelComment } from '@/types';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import NovelComment from './pixiv/novel/[id]/components/NovelFooter/Comment';

export const versionNum = 235;

interface IHistoryItem {
  date: string;
  content: string;
  size?: 'small' | 'normal';
}

export const updateHistory: IHistoryItem[] = [
  {
    date: '2022-12-4',
    content:
      '修复因网络延迟导致的小说评论重复发送问题，删除了同一小说下相同ip发送的相同评论',
  },
  {
    date: '2022-11-15',
    content: '增加隐藏功能缓存小说，完成了数据库缓存的小说、作者、搜索页面',
  },
  {
    date: '2022-11-11',
    content:
      '紧急修复了因pixiv炸号导致的后端失效问题，迁移了所有推荐作者数据并增加请求缓存降低访问频率',
  },
  {
    date: '2022-10-15',
    content: '增加小说阅读页面中的自动滚动功能，该功能位于右上角菜单中',
  },
];

const UpdateItem: React.FC<IHistoryItem> = ({
  date,
  content,
  size = 'small',
}) => {
  const textSize = size === 'small' ? 'text-sm' : 'text-base';
  const dateStr = size === 'small' ? date.slice(5) : date.slice(2);
  const dateWidth = size === 'small' ? 'w-12' : 'w-20';
  return (
    <div
      className={`font-normal my-1 flex text-left ${textSize}`}
      key={content}
    >
      <div className={`font-bold flex-shrink-0 ${dateWidth}`}>{dateStr}</div>
      <div>{content}</div>
    </div>
  );
};

export const UpdateBanner: React.FC = () => {
  return (
    <div className="mx-6" onClick={() => history.push('/update')}>
      <div className="text-xl">最近更新</div>
      {updateHistory.slice(0, 2).map((item) => (
        <UpdateItem {...item} />
      ))}
      <div className="ml-12 text-sm font-normal my-1 flex text-left">……</div>
    </div>
  );
};

const UPDATE_HISTORY_ID = '18849730';

const UpdateHistory = () => {
  // 加载及刷新评论数据
  const [comments, setComments] = useState<INovelComment[]>([]);
  const refreshComments = async () => {
    const comments = await getPixivNovelComments(UPDATE_HISTORY_ID);
    setComments(comments);
  };
  useEffect(() => {
    refreshComments();
  }, []);
  return (
    <PageLayout title="更新历史" rightEle={<></>}>
      <div className="m-4 ml-3">
        {updateHistory.map((item) => (
          <UpdateItem size="normal" {...item} />
        ))}
      </div>
      <NovelComment
        id={UPDATE_HISTORY_ID}
        // commentRef={commentRef}
        showInput={true}
        comments={comments}
        onCommentSuccess={refreshComments}
      />
    </PageLayout>
  );
};

export default UpdateHistory;
