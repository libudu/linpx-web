import React from 'react';
import { history } from 'umi';
import classnames from 'classnames';
import { INovelInfo } from '@/types';

import SharePng from '@/assets/icon/share_big.png';
import LikePng from '@/assets/icon/like_big.png';
import UnlikePng from '@/assets/icon/unlike_big.png';
import DiscussPng from '@/assets/icon/discuss.png';
import { BORDER } from '../..';
import { shareNovel } from '@/utils/share';
import { AfdianImg, openAfdianUrl } from '@/pages/components/Afdian';

interface LinkButtonProps {
  mainTitle: string;
  subTitle: string | undefined;
  path: string | undefined;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  mainTitle,
  subTitle = '',
  path,
}) => {
  return (
    <div
      className={classnames(
        'rounded-full w-36 py-1 flex flex-col justify-center bg-opacity-50',
        path ? 'bg-linpx-orange' : 'bg-linpx-orange-unable',
      )}
      style={{ width: '47%' }}
      onClick={() => path && history.push(path)}
    >
      <div className="text-xl font-black text-center">{mainTitle}</div>
      <div className="text-xs text-center u-line-1 px-4 mx-0.5 mb-0.5">
        {subTitle}
      </div>
    </div>
  );
};

type AroundInfo = {
  title: string;
  id: string;
  order?: string;
};

interface NextButtonProps {
  next: AroundInfo | null;
  prev: AroundInfo | null;
}

const AroundButtons: React.FC<NextButtonProps> = ({ next, prev }) => {
  const getSubTitle = (info: AroundInfo | null, def: string) => {
    if (info?.title) {
      if (info.order) return `#${info.order} ${info.title}`;
      else return `${info.title}`;
    }
    return def;
  };

  return (
    <div className="flex justify-between">
      <LinkButton
        mainTitle={prev?.title ? '上一篇' : '已是第一篇'}
        subTitle={getSubTitle(prev, '*一切的起点*')}
        path={prev?.id && `/pixiv/novel/${prev.id}`}
      />
      <LinkButton
        mainTitle={next?.title ? '下一篇' : '已是最新篇'}
        subTitle={getSubTitle(next, '*快快催更吧*')}
        path={next?.id && `/pixiv/novel/${next.id}`}
      />
    </div>
  );
};

interface NovelFooterProps {
  footerRef: React.RefObject<HTMLDivElement>;
  novelInfo: INovelInfo;
  afdianUrl: string | undefined;
  like: boolean;
  likeCount: number;
  onClickLike: (like: boolean) => any;
}

const NovelFooter: React.FC<NovelFooterProps> = ({
  footerRef,
  novelInfo,
  afdianUrl,
  like,
  likeCount,
  onClickLike,
}) => {
  const { userName, next, prev, series, id } = novelInfo;

  // 仅当系列存在且大于1篇时才显示系列上下篇
  const showSeries = series && (series.next || series.prev);

  const makeIconTextElement = ({
    img,
    text,
    isVertical,
    onClick,
  }: {
    img: React.ReactChild;
    text: React.ReactChild;
    isVertical?: boolean;
    onClick: () => void;
  }) => {
    return (
      <div className="flex justify-center items-center flex-grow py-4">
        <div
          className={classnames('flex justify-center items-center', {
            'flex-col': isVertical,
          })}
          onClick={onClick}
        >
          {typeof img == 'string' ? (
            <img
              className={`w-16 h-16 ${isVertical ? 'mb-2' : 'mr-2'}`}
              src={img}
            />
          ) : (
            img
          )}
          <div>{text}</div>
        </div>
      </div>
    );
  };

  const likeContent = makeIconTextElement({
    img: like ? LikePng : UnlikePng,
    text: (
      <>
        点赞
        <div className="text-sm font-normal leading-none text-yellow-500">
          {likeCount}
        </div>
      </>
    ),
    onClick: () => onClickLike(like),
  });

  const likeContentVertical = makeIconTextElement({
    img: like ? LikePng : UnlikePng,
    text: (
      <>
        点赞
        <span className="ml-2 font-normal text-yellow-500">{likeCount}</span>
      </>
    ),
    onClick: () => onClickLike(like),
    isVertical: true,
  });

  const shareContent = makeIconTextElement({
    img: SharePng,
    text: '分享',
    onClick: () => shareNovel(id),
  });

  const postContent = makeIconTextElement({
    img: DiscussPng,
    text: '发帖',
    onClick: () => history.push(`/post/create?referType=novel&referData=${id}`),
  });

  const afdianContent = makeIconTextElement({
    img: (
      <div className="bg-purple-500 mr-2 rounded-full w-16 h-16 flex items-center justify-center">
        <img className="w-8" src={AfdianImg} />
      </div>
    ),
    text: (
      <>
        支持
        <div className="text-purple-500 text-base font-normal leading-none">
          爱发电
        </div>
      </>
    ),
    onClick: () => openAfdianUrl(userName, afdianUrl || ''),
  });

  return (
    <div
      ref={footerRef}
      className="mb-12 mt-10 mx-6"
      style={{
        border: BORDER,
        borderRadius: '10px',
        boxShadow: '0 0 5px #888',
      }}
    >
      <div
        className="flex text-2xl font-black text-center"
        style={{ borderBottom: BORDER }}
      >
        {afdianUrl ? (
          <>
            <div className="w-1/2" style={{ borderRight: BORDER }}>
              {likeContent}
              <div className="w-full h-0" style={{ borderBottom: BORDER }} />
              {shareContent}
            </div>
            <div className="w-1/2 flex flex-col">
              {afdianContent}
              <div className="w-full h-0" style={{ borderBottom: BORDER }} />
              {/* {postContent} */}
            </div>
          </>
        ) : (
          <>
            <div
              className="w-1/2 flex items-center"
              style={{ borderRight: BORDER }}
            >
              {likeContentVertical}
            </div>
            <div className="w-1/2 flex flex-col">
              {shareContent}
              <div className="w-full h-0" style={{ borderBottom: BORDER }} />
              {/* {postContent} */}
            </div>
          </>
        )}
      </div>
      <div className="p-4 pt-2">
        {showSeries && series ? (
          <>
            <div className="mb-4 u-line-1">
              <span className="text-3xl mr-1 font-black">系列</span>
              <span>{series.title}</span>
            </div>
            <AroundButtons next={series.next} prev={series.prev} />
          </>
        ) : (
          <div className="mt-2">
            <AroundButtons next={prev} prev={next} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NovelFooter;
