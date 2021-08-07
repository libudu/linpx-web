import { useState } from 'react';
import { IRouteProps } from 'umi';
import classNames from 'classnames';

import { ContentNavbar } from '@/components/Navbar';
import {
  useFavUserById,
  usePixivNovel,
  usePixivNovelRead,
  likeNovel,
  unlikeNovel,
} from '@/api';

import NovelIntro from './components/NovelIntro';
import NovelNavbar from './components/NovelNavbar';
import NovelContent from './components/NovelContent';
import NovelFooter from './components/NovelFooter';
import { useCallback } from 'react';
import { throttle } from 'lodash';
import NovelComment from './components/NovelComment';
import NovelAnalyse from './components/NovelAnalyse';
import { linpxRequest } from '@/api/util/request';
import { useEffect } from 'react';
import { INovelAnalyse } from '@/types';

export const BORDER = '1px solid #ccc';

export let updateNovelStyle: any;
export let novelStyle = {
  fontFamily: '',
  fontSizeClass: '',
  bgColor: '',
  color: '#000',
};

let lastScrollTop = 0;

const PixivNovel: React.FC<{ match: IRouteProps }> = ({ match }) => {
  document.title = 'Linpx - 小说详情';
  const id = match.params.id;

  // 样式刷新
  const [refresh, setRefresh] = useState({});
  updateNovelStyle = () => setRefresh({});

  // 基本数据
  const novelInfo = usePixivNovel(id);
  const favUser = useFavUserById(novelInfo?.userId || '');
  const afdianUrl = favUser?.afdian;

  // 统计数据
  usePixivNovelRead(id);
  const [like, setLike] = useState(false);
  const [novelAnalyse, setNovelAnalyse] = useState<INovelAnalyse | null>(null);
  useEffect(() => {
    linpxRequest(`/pixiv/novel/${id}/analyse`).then((data: INovelAnalyse) => {
      setNovelAnalyse(data);
      setLike(!data.canLike);
    });
  }, []);
  const onClickLike = useCallback(
    throttle(
      (like: boolean) => {
        if (like) {
          unlikeNovel(id);
          setLike(false);
        } else {
          likeNovel(id);
          setLike(true);
        }
      },
      500,
      { trailing: false },
    ),
    [],
  );

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

  if (!novelInfo || !novelAnalyse) {
    return <ContentNavbar>小说详情</ContentNavbar>;
  }
  const { content, images } = novelInfo;
  const { readCount, likeCount, canLike } = novelAnalyse;
  const { pixivReadCount, pixivLikeCount } = novelInfo;
  const totalReadCount = readCount + pixivReadCount;
  const totalLikeCount =
    likeCount +
    pixivLikeCount +
    Number(canLike && like) -
    Number(!canLike && !like);

  return (
    <div className="h-screen w-full overflow-y-scroll" onScroll={scrollHandler}>
      <NovelNavbar showNavbar={showNavbar} novelInfo={novelInfo} />
      {novelInfo && (
        <div className="mb-4 w-full">
          <NovelIntro {...novelInfo} {...novelAnalyse} />
          <NovelAnalyse
            like={like}
            likeCount={totalLikeCount}
            readCount={totalReadCount}
            onClickLike={onClickLike}
          />
          <div
            className={classNames(
              'whitespace-pre-line p-4 w-full',
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
          <NovelFooter
            afdianUrl={afdianUrl}
            novelInfo={novelInfo}
            like={like}
            likeCount={totalLikeCount}
            onClickLike={onClickLike}
          />
          <NovelComment id={id} />
        </div>
      )}
    </div>
  );
};

// 页面直接禁止直接复用，避免不同页面跳转时状态混乱
export default function ({ match }: IRouteProps) {
  return <PixivNovel key={match.params.id} match={match} />;
}
