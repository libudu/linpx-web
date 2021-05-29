import { useState } from 'react';
import { IRouteProps } from 'umi';
import { MenuOutlined } from '@ant-design/icons';
import { Popover } from 'antd-mobile';
import { throttle } from 'lodash';
import classNames from 'classnames';

import { ContentNavbar } from '@/components/Navbar';
import { t2s } from '@/utils/util';
import { useFavUserById, usePixivNovel } from '@/api';

import AfdianButton from './components/AfdianButton';
import NovelMenu from './components/NovelMenu';
import NovelIntro from './components/NovelIntro';

export let updateNovelStyle: any;
export let novelStyle = {
  fontFamily: '',
  fontSizeClass: '',
  bgColor: '',
  color: '#000',
};

let lastScrollTop = 0;

export default function PixivNovel({ match }: IRouteProps) {
  document.title = 'Linpx - 小说详情';

  const id = match.params.id;

  const [refresh, setRefresh] = useState({});
  updateNovelStyle = () => setRefresh({});

  const novelInfo = usePixivNovel(id);
  const favUser = useFavUserById(novelInfo?.userId || '');
  const afdianUrl = favUser?.afdian;

  // navbar是否收起
  const [showNavbar, setShowNavbar] = useState(true);
  const [showPopover, setShowPopover] = useState(false);

  // 监听滚动
  const scrollHandler = throttle((e: any) => {
    const scrollTop: number = e.target.scrollTop;
    const shake = 20;
    const change = scrollTop - lastScrollTop;
    // 上滑
    if (change < -shake || scrollTop < 60) {
      setShowNavbar(true);
      // 下滑
    } else if (change > shake) {
      setShowNavbar(false);
      setShowPopover(false);
    }
    lastScrollTop = scrollTop;
  }, 100);

  if (!novelInfo) {
    return <ContentNavbar>小说详情</ContentNavbar>;
  }

  const { content, userId } = novelInfo;

  return (
    <div className="h-screen w-full overflow-y-scroll" onScroll={scrollHandler}>
      <div className="absolute w-full z-20">
        <div
          className="relative w-full"
          style={{ transition: 'all 0.2s', top: showNavbar ? '0px' : '-64px' }}
        >
          <ContentNavbar
            rightEle={
              <Popover
                visible={showPopover}
                overlay={<NovelMenu {...novelInfo} />}
                // @ts-ignore
                overlayStyle={{ width: 'max-content' }}
              >
                <MenuOutlined />
              </Popover>
            }
            backTo={`/pixiv/user/${userId}`}
            children="小说详情"
          />
        </div>
      </div>
      {novelInfo && (
        <div className="mb-4">
          <NovelIntro {...novelInfo} />
          <div
            className={classNames(
              'whitespace-pre-line p-4',
              novelStyle.fontSizeClass,
            )}
            style={{
              pointerEvents: 'none',
              background: novelStyle.bgColor,
              color: novelStyle.color,
              fontFamily: novelStyle.fontFamily,
            }}
          >
            {t2s(content)}
          </div>
          {afdianUrl && <AfdianButton url={afdianUrl} />}
        </div>
      )}
    </div>
  );
}
