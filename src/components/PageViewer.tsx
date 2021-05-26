import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import { Pagination } from 'antd';

interface IPageViewer {
  total: number;
  pageSize: number;
  children: React.ReactNode;
  show?: boolean;
  onPageChange: (page: number) => any;
}

export default function PageViewer({
  total,
  pageSize,
  children: content,
  show = true,
  onPageChange,
}: IPageViewer) {
  // 当前页数由url中查询参数确定
  const [page, setPage] = useState<number>(
    Number(history.location?.query?.page) || 1,
  );

  useEffect(() => {
    onPageChange(page);
  }, [page]);

  // 计算真实页数，处理页数过大、过小情况
  const maxPage = Math.ceil(total / pageSize);
  const truePage = Math.min(Math.max(page, 1), maxPage);
  // 换页后自动滚动到最顶端
  const novelsRef = useRef<HTMLDivElement>(null);

  if (page != truePage) setPage(truePage);

  return (
    <>
      <div ref={novelsRef}>{content}</div>
      {
        // 仅当内容已加载出来，且存在至少一个项目，才显示分页器
        show && total > 0 && (
          <div className="flex justify-center mb-6">
            <Pagination
              pageSize={pageSize}
              current={page}
              total={total}
              showSizeChanger={false}
              onChange={(page) => {
                setPage(page);
                const urlObj = new URL(location.href);
                urlObj.searchParams.set('page', String(page));
                history.replace(urlObj.pathname + urlObj.search);
                novelsRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        )
      }
    </>
  );
}
