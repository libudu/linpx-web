import React from 'react';
import { history } from 'umi';
import classnames from 'classnames';

import { AfdianButton } from '@/pages/components/Afdian';
import { INovelInfo } from '@/types';

import SharePng from '@/assets/icon/share_big.png';
import LikePng from '@/assets/icon/like_big.png';
import UnlikePng from '@/assets/icon/unlike_big.png';
import { BORDER } from '..';

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
      <div className="text-xl font-bold text-center">{mainTitle}</div>
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
  novelInfo: INovelInfo;
  afdianUrl: string | undefined;
  like: boolean;
  likeCount: number;
  onClickLike: (like: boolean) => any;
}

const NovelFooter: React.FC<NovelFooterProps> = ({
  novelInfo,
  afdianUrl,
  like,
  likeCount,
  onClickLike,
}) => {
  const { userName, next, prev, series } = novelInfo;

  // 仅当系列存在且大于1篇时才显示系列上下篇
  const showSeries = series && (series.next || series.prev);

  const likeContent = (
    <div className="flex justify-center items-center flex-grow">
      <div
        className="flex justify-center items-center"
        onClick={() => onClickLike(like)}
      >
        <img className="w-16 mr-2 h-16" src={like ? LikePng : UnlikePng} />
        <div>
          点赞
          <div className="text-sm font-normal text-yellow-500">{likeCount}</div>
        </div>
      </div>
    </div>
  );

  const shareContent = (
    <div className="flex justify-center items-center flex-grow">
      <img className="w-16 mr-2 h-16" src={SharePng} />
      <div>
        分享
        <div className="text-sm font-normal text-center">(还没做好)</div>
      </div>
    </div>
  );

  return (
    <div
      className="mb-12 mt-10 mx-6"
      style={{
        border: BORDER,
        borderRadius: '10px',
        boxShadow: '0 0 5px #888',
      }}
    >
      <div
        className="flex text-2xl font-bold text-center"
        style={{ borderBottom: BORDER }}
      >
        {afdianUrl ? (
          <>
            <div className="w-1/2 py-6" style={{ borderRight: BORDER }}>
              <AfdianButton url={afdianUrl} user={userName} />
            </div>
            <div className="w-1/2 flex flex-col">
              {shareContent}
              <div className="w-full h-0" style={{ borderBottom: BORDER }} />
              {likeContent}
            </div>
          </>
        ) : (
          <div className="flex w-full h-24">
            {shareContent}
            <div className="w-0 h-full" style={{ borderRight: BORDER }} />
            {likeContent}
          </div>
        )}
      </div>
      <div className="p-4 pt-2">
        {showSeries && series ? (
          <>
            <div className="mb-4 u-line-1">
              <span className="text-3xl mr-1 font-bold">系列</span>
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
