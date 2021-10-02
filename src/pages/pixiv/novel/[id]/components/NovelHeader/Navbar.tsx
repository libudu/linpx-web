import { Popover } from 'antd-mobile';
import NovelMenu from './Menu';
import { useState } from 'react';

import { ContentNavbar, MenuIcon } from '@/components/Navbar';
import { INovelInfo } from '@/types';

interface NovelNavbarProps {
  showNavbar: boolean;
  novelInfo: INovelInfo;
}

const NovelNavbar: React.FC<NovelNavbarProps> = ({ showNavbar, novelInfo }) => {
  // navbar是否收起
  const [showPopover, setShowPopover] = useState(false);
  if (showNavbar == false && showPopover == true) {
    setShowPopover(false);
  }

  return (
    <div className="absolute w-full z-30">
      <div
        className="relative w-full"
        style={{ transition: 'all 0.2s', top: showNavbar ? '0px' : '-60px' }}
      >
        <ContentNavbar
          rightEle={
            <Popover
              visible={showPopover}
              overlay={<NovelMenu {...novelInfo} />}
              overlayStyle={{
                width: 'max-content',
                borderRadius: '10px',
                position: 'relative',
              }}
              align={{
                // @ts-ignore
                offset: [3, 30],
              }}
            >
              <MenuIcon />
            </Popover>
          }
          backTo={`/pixiv/user/${novelInfo.userId}`}
          children="小说详情"
        />
      </div>
    </div>
  );
};

export default NovelNavbar;
