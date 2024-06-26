import { useState, useEffect, useRef, useCallback } from 'react';
import { throttle } from 'lodash';
import { IRouteProps, history } from 'umi';

import { ContentNavbar } from '@/components/Navbar';
import {
  useFavUserById,
  usePixivNovel,
  readNovel,
  likeNovel,
  unlikeNovel,
  getPixivNovelComments,
  usePixivNovelProfiles,
} from '@/api';
import { linpxRequest } from '@/api/util/request';
import { INovelAnalyse, INovelComment } from '@/types';

import NovelIntro from './components/NovelHeader/Intro';
import NovelNavbar from './components/NovelHeader/Navbar';
import NovelContent from './components/NovelContent';
import NovelFooter from './components/NovelFooter/Tools';
import NovelComment from './components/NovelFooter/Comment';
import NovelAnalyse from './components/NovelHeader/Analyse';
import { eleScrollToPos, useRecordLastScroll } from '@/utils/scrollRecord';
import { checkLinpxNovel } from './util';
import { pushHistory } from '@/pages/history';
import { fromReadResource, getAddShelfScheme } from '@/pages/biz/readresource';
import { recordReadProgress } from '@/utils/readProgress';
import { isBlockUser } from '@/config/cache';

export const BORDER = '1px solid #ccc';

let lastScrollTop = 0;

const useNovelComments = (id: string) => {
  const [comments, setComments] = useState<INovelComment[]>([]);
  const refreshComments = useCallback(async () => {
    const comments = await getPixivNovelComments(id);
    setComments(comments);
  }, []);
  useEffect(() => {
    refreshComments();
  }, []);
  return {
    comments,
    setComments,
    refreshComments,
  };
};

const PixivNovel: React.FC<{ match: IRouteProps }> = ({ match }) => {
  const location = history.location;
  const isCache = location.pathname.endsWith('cache');

  document.title = 'Linpx - 小说详情';
  const id = match.params.id;

  // 基本数据
  const novelProfile = (usePixivNovelProfiles([id]) || [null])[0];
  const novelInfo = usePixivNovel(id, isCache);
  const favUser = useFavUserById(novelInfo?.userId || '');
  const afdianUrl = favUser?.afdian;

  // 加载及刷新评论数据
  const { comments, refreshComments } = useNovelComments(id);

  // 统计数据
  const [like, setLike] = useState(false);
  const [novelAnalyse, setNovelAnalyse] = useState<INovelAnalyse | null>(null);

  // 底部工具栏引用，点击评论图标后滚动到底部
  const footerRef = useRef<HTMLDivElement>(null);

  // 记忆上次游览位置
  const ref = useRef<HTMLDivElement>(null);
  useRecordLastScroll(ref);

  // 初始化
  useEffect(() => {
    // 是否有初始滚动
    const pos = Number(location.query?.pos);
    if (pos) {
      eleScrollToPos(ref.current, pos);
    }
    // 历史记录
    pushHistory({
      type: 'pn',
      id,
      time: Date.now(),
    });
    // 阅读数增加
    readNovel(id);
    // 请求小说分析数据
    linpxRequest(`/pixiv/novel/${id}/analyse`, false).then(
      (data: INovelAnalyse) => {
        setNovelAnalyse(data);
        setLike(!data.canLike);
      },
    );
    // 初始化自动滚动接口
    const ele = ref.current;
    if (ele) {
      ele.scrollTop += 10;
    }
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

  // 监听滚动，滚动会影响顶部导航栏和底部评论输入框
  const commentRef = useRef<HTMLDivElement>(null);
  const [showInput, setShowInput] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const scrollHandler = useCallback(
    throttle((e: any) => {
      const { scrollTop, offsetHeight } = e.target;
      // 记录游览位置
      recordReadProgress({
        path: location.pathname,
        pos: scrollTop,
        total:
          (commentRef.current?.offsetTop || 0) -
          document.documentElement.clientHeight,
        id,
      });
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

  // content是否加载完成，主要用于图片预加载
  const [contentLoaded, setContentLoaded] = useState(false);

  if (!novelInfo || isBlockUser(novelInfo?.userId)) {
    return <div></div>;
  }

  if (!novelInfo || !novelAnalyse || !novelProfile) {
    return (
      <div className="w-full h-full overflow-y-scroll" ref={ref}>
        <ContentNavbar>小说详情</ContentNavbar>
      </div>
    );
  }
  const { content, images } = novelInfo;
  const { readCount, likeCount, canLike } = novelAnalyse;
  const { pixivReadCount } = novelInfo;
  const { pixivLikeCount } = novelProfile;
  const totalReadCount = readCount + pixivReadCount;
  const totalLikeCount =
    likeCount +
    pixivLikeCount +
    Number(canLike && like) -
    Number(!canLike && !like);

  const isLinpxNovel = checkLinpxNovel(novelInfo);

  return (
    <div
      className="w-full h-full overflow-y-scroll"
      onScroll={scrollHandler}
      ref={ref}
    >
      <NovelNavbar
        showNavbar={showNavbar}
        novelInfo={novelInfo}
        containerRef={ref}
      />
      {fromReadResource && (
        <div
          className="w-full py-2 bg-white absolute bottom-0 bg-linpx-orange text-center text-3xl font-bold"
          onClick={() => {
            window.open(getAddShelfScheme(id, isCache));
          }}
        >
          添加到书架
        </div>
      )}
      {novelInfo && (
        <>
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
          <NovelContent
            isLinpxNovel={isLinpxNovel}
            text={content}
            images={images}
            containerRef={ref}
            onLoad={() => setContentLoaded(true)}
          />
          {contentLoaded && !isLinpxNovel && (
            <>
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
                onCommentSuccess={refreshComments}
                onCommentDelete={refreshComments}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

// 页面直接禁止直接复用，避免不同页面跳转时状态混乱
export default function ({ match }: IRouteProps) {
  return <PixivNovel key={match.params.id} match={match} />;
}
