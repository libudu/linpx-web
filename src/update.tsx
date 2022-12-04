import MidAutumnImg from '@/assets/banner/midautumn.jpg';

export const versionNum = 235;

export const updateHistory: {
  date: string;
  content: string;
}[] = [
  {
    date: '2022-12-4',
    content:
      '修复因网络延迟导致的小说评论重复发送问题，删除了同一小说下相同ip发送的相同评论',
  },
  // {
  //   date: '2022-11-15',
  //   content: '增加隐藏功能缓存小说，完成了数据库缓存的小说、作者、搜索页面',
  // },
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

export const UpdateBanner = () => {
  return (
    <div className="mx-6">
      <div className="text-xl">最近更新</div>
      {updateHistory.slice(0, 2).map(({ date, content }) => {
        return (
          <div
            className="text-sm font-normal my-1 flex text-left"
            key={content}
          >
            <div className="font-bold flex-shrink-0 w-12">{date.slice(5)}</div>
            <div>{content}</div>
          </div>
        );
      })}
      {/* { todo: 点击查看全部日志功能完成后，给出省略号提示 } */}
      {/* <div className="ml-12 text-sm font-normal my-1 flex text-left">……</div> */}
    </div>
  );
};

const UpdateHistory = () => {
  return <div>123</div>;
};

export default UpdateHistory;
