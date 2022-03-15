import PageLayout from '@/components/PageLayout';
import TopImg from '@/assets/icon/top.png';
import { stringHash } from '@/utils/util';
import { Pagination } from 'antd';
import { postApi } from '@/api';
import { history } from 'umi';
import { useEffect, useState } from 'react';

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

// 按事件排序
// 帖子分区
// todo:后端限制，每分钟最多发2条新帖，每小时最多发5条，每天最多发10条帖子
export default function () {
  const [page, setPage] = useState(1);
  const res = postApi.usePage({ page });
  let children = null;
  if (res) {
    const { records: postList, pageSize, total } = res;
    children = (
      <>
        <div className="text-lg">
          {topPostList.map(({ title }, index) => (
            <div
              className="flex px-4 py-2 hover:bg-gray-100 transition-all cursor-pointer"
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

        <div
          className="flex justify-between text-lg p-2 px-4"
          style={{ borderBottom: '1px solid #eee' }}
        >
          <div>帖子总数：{total}</div>
          <div>最新回复排序</div>
        </div>

        {
          // 当前页帖子预览
          postList.map(({ ip, title, content, _time, id }) => (
            <div
              className="px-4 py-2 hover:bg-gray-100 transition-all cursor-pointer"
              style={{ borderBottom: '1px solid #eee' }}
              onClick={() => {
                history.push('/post/' + id);
              }}
            >
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <div>{stringHash(ip)}</div>
                <div>{new Date(_time * 1000).toLocaleString()}</div>
                <div style={{ width: '10%' }}></div>
              </div>
              <div className="u-line-1 font-bold">{title}</div>
              <div className="u-line-2 text-base">{content}</div>
            </div>
          ))
        }
        {
          // 两页以上显示分页器
          total > pageSize && (
            <div className="flex justify-center my-4">
              <Pagination
                pageSize={pageSize}
                current={page}
                total={total}
                showSizeChanger={false}
                onChange={(e) => {
                  setPage(e);
                }}
              />
            </div>
          )
        }
        <div
          className="absolute bg-yellow-500 rounded-full"
          style={{
            right: 18,
            bottom: 40,
            width: 80,
            height: 80,
            fontSize: 100,
            textAlign: 'center',
            lineHeight: '68px',
          }}
          onClick={() => history.push('/post/create')}
        >
          +
        </div>
      </>
    );
  }
  return <PageLayout title="最近帖子">{children}</PageLayout>;
}
