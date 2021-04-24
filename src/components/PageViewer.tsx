import { useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import { Pagination } from 'antd';

interface IPageViewer {
  total: number;
  pageSize: number;
  renderContent: (page: number) => any;
}

export default function PageViewer({
  total,
  pageSize,
  renderContent,
}: IPageViewer) {
  // 当前页数由url中查询参数确定
  const [page, setPage] = useState<number>(
    Number(history.location?.query?.page) || 1,
  );
  // 计算真实页数，处理页数过大、过小情况
  const maxPage = Math.ceil(total / pageSize);
  const truePage = Math.min(Math.max(page, 1), maxPage);
  // 换页后自动滚动到最顶端
  const novelsRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState();
  useEffect(() => {
    (async () => {
      setContent(await renderContent(page));
    })();
  }, [page]);

  if (page != truePage) setPage(truePage);

  return (
    <>
      <div ref={novelsRef}>{content}</div>
      <div className="flex justify-center mb-6">
        <Pagination
          pageSize={pageSize}
          current={page}
          total={total}
          showSizeChanger={false}
          onChange={(page) => {
            setPage(page);
            history.push(history.location.pathname + `?page=${page}`);
            novelsRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>
    </>
  );
}
