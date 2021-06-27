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
        'rounded-full w-36 px-5 flex flex-col justify-center bg-opacity-50',
        path ? 'bg-linpx-orange' : 'bg-linpx-orange-unable',
      )}
      style={{ height: 56 }}
      onClick={() => path && history.push(path)}
    >
      <div className="text-lg font-bold text-center">{mainTitle}</div>
      <div className="text-sm text-center u-line-1">{subTitle}</div>
    </div>
  );
};

type AroundInfo = {
  title: string;
  id: string;
};

interface NextButtonProps {
  next: AroundInfo | null;
  prev: AroundInfo | null;
}

const AroundButtons: React.FC<NextButtonProps> = ({ next, prev }) => {
  return (
    <div className="flex justify-between px-6">
      <LinkButton
        mainTitle={next?.title ? '上一篇' : '已是第一篇'}
        subTitle={next?.title || ''}
        path={next?.id && `/pixiv/novel/${next.id}`}
      />
      <LinkButton
        mainTitle={prev?.title ? '下一篇' : '已是最新篇'}
        subTitle={prev?.title || '快快催更吧'}
        path={prev?.id && `/pixiv/novel/${prev.id}`}
      />
    </div>
  );
};

interface NovelFooterProps {
  novelInfo: INovelInfo;
  afdianUrl: string | undefined;
}

const NovelFooter: React.FC<NovelFooterProps> = ({ novelInfo, afdianUrl }) => {
  const { userName, next, prev } = novelInfo;

  return (
    <div className="mb-12">
      {afdianUrl && <AfdianButton url={afdianUrl} user={userName} />}
      <AroundButtons next={next} prev={prev} />
    </div>
  );
};

export default NovelFooter;
