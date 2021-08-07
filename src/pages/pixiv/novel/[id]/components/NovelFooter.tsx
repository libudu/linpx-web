import React from 'react';
import { history } from 'umi';
import classnames from 'classnames';

import { AfdianButton } from '@/pages/components/Afdian';
import { INovelInfo } from '@/types';

import SharePng from '@/assets/icon/share_big.png';
import LikePng from '@/assets/icon/like_big.png';
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
  like: number;
}

const NovelFooter: React.FC<NovelFooterProps> = ({
  novelInfo,
  afdianUrl,
  like,
}) => {
  const { userName, next, prev, series } = novelInfo;

  // 仅当系列存在且大于1篇时才显示系列上下篇
  const showSeries = series && (series.next || series.prev);

  return (
    <div
      className="mb-12 mt-10 mx-6"
      style={{ border: BORDER, borderRadius: '10px' }}
    >
      <div className="flex text-2xl font-bold" style={{ borderBottom: BORDER }}>
        {afdianUrl ? (
          <>
            <div className="w-1/2 py-6" style={{ borderRight: BORDER }}>
              <AfdianButton url={afdianUrl} user={userName} />
            </div>
            <div className="w-1/2">
              <div
                className="flex justify-center items-center h-1/2"
                style={{ borderBottom: BORDER }}
              >
                <img className="w-16 mr-2 h-16" src={SharePng} />
                <div>分享</div>
              </div>
              <div className="flex justify-center items-center h-1/2">
                <img className="w-16 mr-2 h-16" src={LikePng} />
                <div>
                  点赞
                  <div className="text-sm font-normal text-yellow-500 text-center">
                    {like}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex w-full">
            <div
              className="flex justify-center items-center w-1/2 py-4"
              style={{ borderRight: BORDER }}
            >
              <img className="w-16 mr-2 h-16" src={SharePng} />
              <div>分享</div>
            </div>
            <div className="flex justify-center items-center w-1/2">
              <img className="w-16 mr-2 h-16" src={LikePng} />
              <div>
                点赞
                <div className="text-sm font-normal text-yellow-500 text-center">
                  {like}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-4 pt-2 pb-4">
        {showSeries && series ? (
          <>
            <div className="mb-4 u-line-1">
              <span className="text-3xl mr-1 font-bold">系列</span>
              <span>{series.title}</span>
            </div>
            <AroundButtons next={series.next} prev={series.prev} />
          </>
        ) : (
          <AroundButtons next={prev} prev={next} />
        )}
      </div>
    </div>
  );
};

export default NovelFooter;
