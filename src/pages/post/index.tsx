import PageLayout from '@/components/PageLayout';
import TopImg from '@/assets/icon/top.png';
import { stringHash } from '@/utils/util';

const topPostList = [
  {
    title: '【规章】LINPX匿名版聊社区规范',
  },
  {
    title: '【教程】LINPX使用指南',
  },
  {
    title: '【闲聊】LINPX的起源、现状和未来',
  },
];

const postList = [
  {
    ip: '103.142.140.83, 103.142.140.83',
    _time: 1646334180,
    title: '标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题',
    text: '正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正',
  },
];

// 按事件排序
// 帖子分区
// todo:后端限制，每分钟最多发2条新帖，每小时最多发5条，每天最多发10条帖子
export default function () {
  return (
    <div>
      <PageLayout title="最近帖子">
        <div className="text-lg">
          {topPostList.map(({ title }, index) => (
            <div
              className="flex mx-4 py-2"
              style={{
                borderBottom:
                  index != topPostList.length - 1
                    ? '1px solid #ddd'
                    : undefined,
              }}
            >
              <img
                style={{ width: 22, height: 22, position: 'relative', top: 4 }}
                src={TopImg}
              />
              <div>{title}</div>
            </div>
          ))}
          {topPostList.length > 0 && (
            <div style={{ backgroundColor: '#eee', height: 18 }} />
          )}
        </div>
        {postList.map(({ ip, title, text, _time }) => (
          <div className="mx-4 py-2">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <div>{stringHash(ip)}</div>
              <div>{new Date(_time * 1000).toLocaleString()}</div>
              <div style={{ width: '10%' }}></div>
            </div>
            <div className="u-line-1 font-bold">{title}</div>
            <div className="u-line-2 text-base">{text}</div>
          </div>
        ))}
      </PageLayout>
    </div>
  );
}
