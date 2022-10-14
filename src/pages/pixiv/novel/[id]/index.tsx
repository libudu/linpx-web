import { useState, useEffect, useRef, useCallback } from 'react';
import { throttle } from 'lodash';
import { IRouteProps } from 'umi';

import { ContentNavbar } from '@/components/Navbar';
import {
  useFavUserById,
  usePixivNovel,
  readNovel,
  likeNovel,
  unlikeNovel,
  getPixivNovelComments,
} from '@/api';
import { linpxRequest } from '@/api/util/request';
import { INovelAnalyse, INovelComment } from '@/types';

import NovelIntro from './components/NovelHeader/Intro';
import NovelNavbar from './components/NovelHeader/Navbar';
import NovelContent from './components/NovelContent';
import NovelFooter from './components/NovelFooter/Tools';
import NovelComment from './components/NovelFooter/Comment';
import NovelAnalyse from './components/NovelHeader/Analyse';
import { useRecordLastScroll } from '@/layouts';

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
  const refreshComments = async () => {
    const comments = await getPixivNovelComments(id);
    setComments(comments);
  };

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
    // 阅读数增加
    readNovel(id);
    // 获取评论
    refreshComments();
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

  if (!novelInfo || !novelAnalyse) {
    return (
      <div className="w-full h-full overflow-y-scroll" ref={ref}>
        <ContentNavbar>小说详情</ContentNavbar>
      </div>
    );
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

  // 判断是否是linpx-novel
  const desc = novelInfo.desc.toLowerCase();
  const isLinpxNovel =
    desc.includes('【linpx-novel】') || desc.includes('【linpxnovel】');

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
          />
          {!isLinpxNovel && (
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
                onCommentSuccess={() => refreshComments()}
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
