import { INovelInfo } from '@/types';
import React from 'react';

import { AfdianButton } from '@/pages/components/Afdian';

interface NovelFooterProps {
  novelInfo: INovelInfo;
  afdianUrl: string | undefined;
}

const NovelFooter: React.FC<NovelFooterProps> = ({ novelInfo, afdianUrl }) => {
  const { userName } = novelInfo;
  return <>{afdianUrl && <AfdianButton url={afdianUrl} user={userName} />}</>;
};

export default NovelFooter;
