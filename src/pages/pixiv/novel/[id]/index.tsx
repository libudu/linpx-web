import { useState } from 'react';
import { IRouteProps } from 'umi';
import classNames from 'classnames';

import { ContentNavbar } from '@/components/Navbar';
import { useFavUserById, usePixivNovel } from '@/api';

import NovelIntro from './components/NovelIntro';
import NovelNavbar from './components/NovelNavbar';
import NovelContent from './components/NovelContent';
import NovelFooter from './components/NovelFooter';
import { useCallback } from 'react';
import { throttle } from 'lodash';

export let updateNovelStyle: any;
export let novelStyle = {
  fontFamily: '',
  fontSizeClass: '',
  bgColor: '',
  color: '#000',
};

let lastScrollTop = 0;
export default function PixivNovel({ match }: IRouteProps) {
  document.title = 'Linpx - 小说详情';

  const id = match.params.id;

  const [refresh, setRefresh] = useState({});
  updateNovelStyle = () => setRefresh({});

  const novelInfo = usePixivNovel(id);
  const favUser = useFavUserById(novelInfo?.userId || '');
  const afdianUrl = favUser?.afdian;

  // 监听滚动
  const [showNavbar, setShowNavbar] = useState(true);

  const scrollHandler = useCallback(
    throttle((e: any) => {
      const scrollTop: number = e.target.scrollTop;
      const shake = 20;
      const change = scrollTop - lastScrollTop;
      // 上滑
      if (change < -shake || scrollTop < 60) {
        setShowNavbar(true);
        // 下滑
      } else if (change > shake) {
        setShowNavbar(false);
      }
      lastScrollTop = scrollTop;
    }, 100),
    [],
  );

  if (!novelInfo) {
    return <ContentNavbar>小说详情</ContentNavbar>;
  }

  const { content, userName, images } = novelInfo;

  return (
    <div className="h-screen w-full overflow-y-scroll" onScroll={scrollHandler}>
      <NovelNavbar showNavbar={showNavbar} novelInfo={novelInfo} />
      {novelInfo && (
        <div className="mb-4">
          <NovelIntro {...novelInfo} />
          <div
            className={classNames(
              'whitespace-pre-line p-4',
              novelStyle.fontSizeClass,
            )}
            style={{
              pointerEvents: 'none',
              background: novelStyle.bgColor,
              color: novelStyle.color,
              fontFamily: novelStyle.fontFamily,
            }}
          >
            <NovelContent text={content} images={images} />
          </div>
          <NovelFooter afdianUrl={afdianUrl} novelInfo={novelInfo} />
        </div>
      )}
    </div>
  );
}
