import { ContentNavbar } from '@/components/Navbar';
import { currDrawerPath } from '@/layouts/DrawerLayout';
import NovelCard from '@/pages/components/NovelCard';
import { useEffect, useRef, useState } from 'react';
import { getRecentNovels, INovelProfile } from '@/utils/api';
import { history } from 'umi';
import PageViewer from '@/components/PageViewer';

// 每页十个，由后端接口限定
const pageSize = 10;
const TotalPage = 74;

export default function () {
  document.title = 'Linpx - 最近小说';

  return (
    <>
      <ContentNavbar backTo={currDrawerPath}>最近小说</ContentNavbar>
      <PageViewer
        total={pageSize * TotalPage}
        pageSize={pageSize}
        renderContent={async (page) => {
          const novelProfileList = await getRecentNovels(page);
          return (
            <div className="px-4 pt-16">
              {novelProfileList.map((novelProfile) => (
                <NovelCard {...novelProfile} key={novelProfile.id} />
              ))}
            </div>
          );
        }}
      />
    </>
  );
}
