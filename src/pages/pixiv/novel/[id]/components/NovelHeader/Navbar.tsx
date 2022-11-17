import { Popover } from 'antd-mobile';
import NovelMenu, { INovelMenu } from './Menu';
import { useState } from 'react';

import { ContentNavbar, MenuIcon } from '@/components/Navbar';
import { INovelInfo } from '@/types';

interface NovelNavbarProps {
  showNavbar: boolean;
  novelInfo: INovelInfo;
  containerRef: INovelMenu['containerRef'];
}

const NovelNavbar: React.FC<NovelNavbarProps> = ({
  showNavbar,
  novelInfo,
  containerRef,
}) => {
  const isCache = location.pathname.endsWith('/cache');

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
              overlay={
                <NovelMenu
                  id={novelInfo.id}
                  hideMenu={() => {
                    setShowPopover(false);
                  }}
                  containerRef={containerRef}
                />
              }
              overlayStyle={{
                width: 'max-content',
                borderRadius: '10px',
                position: 'relative',
              }}
              onVisibleChange={(visible) => setShowPopover(visible)}
              align={{
                // @ts-ignore
                offset: [3, 30],
              }}
            >
              <MenuIcon />
            </Popover>
          }
          backTo={`/pixiv/user/${novelInfo.userId}`}
          children={isCache ? '缓存小说' : '小说详情'}
        />
      </div>
    </div>
  );
};

export default NovelNavbar;
