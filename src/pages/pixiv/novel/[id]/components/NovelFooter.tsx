import React from 'react';
import { history } from 'umi';
import classnames from 'classnames';

import { AfdianButton } from '@/pages/components/Afdian';
import { INovelInfo } from '@/types';

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
        'rounded-full w-36 px-4 py-1 flex flex-col justify-center bg-opacity-50',
        path ? 'bg-linpx-orange' : 'bg-linpx-orange-unable',
      )}
      style={{ width: '47%' }}
      onClick={() => path && history.push(path)}
    >
      <div className="text-xl font-bold text-center">{mainTitle}</div>
      <div className="text-sm text-center u-line-1">{subTitle}</div>
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
  return (
    <div className="flex justify-between">
      <LinkButton
        mainTitle={prev?.title ? '上一篇' : '已是第一篇'}
        subTitle={prev?.title ? `#${prev.order} ${prev.title}` : '*一切的起点*'}
        path={prev?.id && `/pixiv/novel/${prev.id}`}
      />
      <LinkButton
        mainTitle={next?.title ? '下一篇' : '已是最新篇'}
        subTitle={next?.title ? `#${next.order} ${next.title}` : '*快快催更吧*'}
        path={next?.id && `/pixiv/novel/${next.id}`}
      />
    </div>
  );
};

interface NovelFooterProps {
  novelInfo: INovelInfo;
  afdianUrl: string | undefined;
}

const NovelFooter: React.FC<NovelFooterProps> = ({ novelInfo, afdianUrl }) => {
  const { userName, next, prev, series } = novelInfo;

  // 仅当系列存在且大于1篇时才显示系列上下篇
  const showSeries = series && (series.next || series.prev);

  return (
    <div className="mb-12 mt-10">
      {afdianUrl && <AfdianButton url={afdianUrl} user={userName} />}
      <div className="px-6">
        {showSeries && series ? (
          <>
            <div className="mb-5 u-line-1">
              <span className="text-3xl font-bold">系列</span>
              <span>{series.title}</span>
            </div>
            <AroundButtons next={series.next} prev={series.prev} />
          </>
        ) : (
          <AroundButtons next={next} prev={prev} />
        )}
      </div>
    </div>
  );
};

export default NovelFooter;
