import PageLayout from '@/components/PageLayout';
import { history } from 'umi';
import { NovelCommentById } from './pixiv/novel/[id]/components/NovelFooter/Comment';
import NewPng from '@/assets/icon/new.png';

export const versionNum = 246;

interface IHistoryItem {
  date: string;
  content: string;
  size?: 'small' | 'normal';
}

export const updateHistory: IHistoryItem[] = [
  {
    date: '2023-1-16',
    content:
      '点击作者Q群时会复制群号，修复了小说简介中存在链接时点击跳转错误的问题',
  },
  {
    date: '2023-1-15',
    content:
      '增加了阅读历史清空功能，搜索推荐作者时不再区分大小写，小说评论支持回复其他评论',
  },
  {
    date: '2022-12-19',
    content: '增加了阅读历史功能，该功能位于左侧弹出导航栏中。',
  },
  {
    date: '2022-12-5',
    content: '增加了更新历史横幅和详情页面。评论增加了倒序查看功能',
  },
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
    date: '2022-10-18',
    content: '修复了tag和作者小说页面点进小说后不能记录上次游览位置的问题',
  },
  {
    date: '2022-10-18',
    content:
      '修复了设置字号的时候导致背景必然置白的问题，修复了小说内容未加载而评论已加载导致闪动的问题',
  },
  {
    date: '2022-10-15',
    content: '增加小说阅读页面中的自动滚动功能，该功能位于右上角菜单中',
  },
  {
    date: '2022-10-9',
    content: '修复了首页直接点击tag跳转路由错误的问题',
  },
  {
    date: '2021-5-15',
    content: '增加隐藏功能下载小说',
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
  const lastUpdateDate = new Date(updateHistory[0].date);
  const isNew = Date.now() - lastUpdateDate.getTime() < 1000 * 60 * 60 * 24 * 2;
  return (
    <div className="mx-6">
      <div className="flex justify-center items-center text-xl">
        最近更新
        {isNew && (
          <img
            className="mt-0.5 h-4 ml-1 rounded-sm object-contain"
            src={NewPng}
          />
        )}
      </div>
      {updateHistory.slice(0, 2).map((item) => (
        <UpdateItem key={item.content} {...item} />
      ))}
      <div className="ml-12 text-sm font-normal my-1 flex text-left">……</div>
    </div>
  );
};

const UPDATE_HISTORY_ID = '18849730';

const UpdateHistory = () => {
  return (
    <PageLayout title="更新历史" rightEle={<></>}>
      <div className="m-4 ml-3">
        {updateHistory.map((item) => (
          <UpdateItem size="normal" {...item} />
        ))}
      </div>
      <NovelCommentById id={UPDATE_HISTORY_ID} />
    </PageLayout>
  );
};

export default UpdateHistory;
