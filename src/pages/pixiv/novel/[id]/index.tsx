import { useState, useEffect, useRef, useCallback } from 'react';
import { throttle } from 'lodash';
import { IRouteProps } from 'umi';

import { ContentNavbar } from '@/components/Navbar';
import {
  useFavUserById,
  usePixivNovel,
  usePixivNovelRead,
  likeNovel,
  unlikeNovel,
  getPixivNovelComments,
} from '@/api';
import { linpxRequest } from '@/api/util/request';
import { INovelAnalyse, INovelComment } from '@/types';

import NovelIntro from './components/NovelIntro';
import NovelNavbar from './components/NovelNavbar';
import NovelContent from './components/NovelContent';
import NovelFooter from './components/NovelFooter';
import NovelComment from './components/NovelComment';
import NovelAnalyse from './components/NovelAnalyse';

export const BORDER = '1px solid #ccc';

let lastScrollTop = 0;

const PixivNovel: React.FC<{ match: IRouteProps }> = ({ match }) => {
  document.title = 'Linpx - 小说详情';
  const id = match.params.id;

  // 基本数据
  const novelInfo = usePixivNovel(id);
  const favUser = useFavUserById(novelInfo?.userId || '');
  const afdianUrl = favUser?.afdian;

  // 加载及刷新评论数据
  const [comments, setComments] = useState<INovelComment[]>([]);
  const refreshComments = () => {
    return getPixivNovelComments(id).then((res) => {
      setComments(res);
    });
  };

  // 统计数据
  usePixivNovelRead(id);
  const [like, setLike] = useState(false);
  const [novelAnalyse, setNovelAnalyse] = useState<INovelAnalyse | null>(null);
  useEffect(() => {
    refreshComments();
    linpxRequest(`/pixiv/novel/${id}/analyse`, false).then(
      (data: INovelAnalyse) => {
        setNovelAnalyse(data);
        setLike(!data.canLike);
      },
    );
  }, []);
  // 点击喜欢/取消喜欢
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
  const commentRef = useRef<HTMLDivElement>(null);
  const [showInput, setShowInput] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const scrollHandler = useCallback(
    throttle((e: any) => {
      const { scrollTop, offsetHeight } = e.target;
      const shake = 20;
      const change = scrollTop - lastScrollTop;
      // 顶部标题
      // 上滑
      if (change < -shake || scrollTop < 60) {
        setShowNavbar(true);
        // 下滑
      } else if (change > shake) {
        setShowNavbar(false);
      }
      lastScrollTop = scrollTop;
      // 底部评论
      const commentDistance =
        offsetHeight + scrollTop - (commentRef.current?.offsetTop || 0);
      if (commentDistance > 150) {
        setShowInput(true);
      } else {
        setShowInput(false);
      }
    }, 100),
    [],
  );

  // 底部工具栏引用
  const footerRef = useRef<HTMLDivElement>(null);

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
    <div className="w-full h-full overflow-y-scroll" onScroll={scrollHandler}>
      <NovelNavbar showNavbar={showNavbar} novelInfo={novelInfo} />
      {novelInfo && (
        <div className="w-full">
          <NovelIntro {...novelInfo} {...novelAnalyse} />
          <NovelAnalyse
            like={like}
            likeCount={totalLikeCount}
            readCount={totalReadCount}
            commentCount={comments.length}
            onClickLike={onClickLike}
            onClickComment={() => {
              footerRef.current?.scrollIntoView();
            }}
          />
          <NovelContent text={content} images={images} />
          <NovelFooter
            footerRef={footerRef}
            afdianUrl={afdianUrl}
            novelInfo={novelInfo}
            like={like}
            likeCount={totalLikeCount}
            onClickLike={onClickLike}
          />
          <NovelComment
            id={id}
            commentRef={commentRef}
            showInput={showInput}
            comments={comments}
            onCommentSuccess={() => refreshComments()}
          />
        </div>
      )}
    </div>
  );
};

// 页面直接禁止直接复用，避免不同页面跳转时状态混乱
export default function ({ match }: IRouteProps) {
  return <PixivNovel key={match.params.id} match={match} />;
}
