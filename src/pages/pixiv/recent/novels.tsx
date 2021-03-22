import { ContentNavbar } from '@/components/Navbar';
import { currDrawerPath } from '@/layouts/DrawerLayout';
import NovelCard from '@/components/NovelCard';
import { useEffect, useRef, useState } from 'react';
import { getRecentNovels, INovelProfile } from '@/utils/api';
import { history } from 'umi';
import { Pagination } from 'antd';

const TotalPage = 74;

export default function () {
  document.title = 'Linpx - 最近小说';

  const scrollRef = useRef<HTMLDivElement>(null);

  // 当前页数
  const [page, setPage] = useState<number>(
    Math.min(
      Math.max(Number(history.location?.query?.page) || 1, 1),
      TotalPage,
    ),
  );

  const [novelsInfo, setNovelsInfo] = useState<INovelProfile[]>([]);
  useEffect(() => {
    getRecentNovels(page).then((res) => {
      setNovelsInfo(res);
    });
  }, [page]);

  return (
    <>
      <ContentNavbar backTo={currDrawerPath}>最近小说</ContentNavbar>
      <div className="h-screen overflow-scroll" ref={scrollRef}>
        <div className="text-center m-6 mt-20">
          {novelsInfo.map((ele: INovelProfile) => (
            <div key={ele.id}>
              <NovelCard {...ele} />
            </div>
          ))}
        </div>
        <div className="flex justify-center my-6">
          <Pagination
            pageSize={10}
            current={page}
            total={10 * TotalPage}
            showSizeChanger={false}
            onChange={(page) => {
              setPage(page);
              history.push(location.pathname + `?page=${page}`);
              scrollRef.current?.scrollTo(0, 0);
            }}
          />
        </div>
      </div>
    </>
  );
}
