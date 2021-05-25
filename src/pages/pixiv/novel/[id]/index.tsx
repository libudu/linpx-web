import { useState, useEffect } from 'react';
import { IRouteProps, history } from 'umi';
import { MenuOutlined } from '@ant-design/icons';
import { Popover } from 'antd-mobile';
import { throttle } from 'lodash';
import classNames from 'classnames';

import { ContentNavbar } from '@/components/Navbar';
import Tag from '@/components/Tag';
import { t2s } from '@/utils/util';
import { usePixivNovel } from '@/utils/api';

import NovelMenu from './components/NovelMenu';

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

  const {
    title,
    content,
    userName,
    userId,
    coverUrl,
    tags,
    desc,
    createDate,
  } = novelInfo;

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
                overlay={<NovelMenu id={id} />}
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
        <>
          <div className="py-4 pt-20 text-center bg-yellow-100 bg-opacity-25 shadow-lg relative z-10">
            <div className="flex justify-center">
              <img src={coverUrl} className="h-64 rounded-lg" />
            </div>
            <div className="mt-2 mx-8 font-bold text-3xl">{title}</div>
            <div
              className="px-16 text-2xl text-gray-500 underline"
              onClick={() => history.push(`/pixiv/user/${userId}`)}
            >
              {userName}
            </div>
            <div className="mb-1 text-base text-gray-500">
              <span>{content.length}字</span>
              <span className="ml-4">
                {new Date(createDate).toLocaleString()}
              </span>
            </div>
            <div className="text-gray-500 text-base px-8">
              {tags.map((ele) => (
                <Tag key={ele} children={ele} />
              ))}
            </div>
            <div
              className="px-8 mt-1 text-base"
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          </div>
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
          <div className="absolute bottom-0 w-full bg-white">
            <div></div>
            <div></div>
          </div>
        </>
      )}
    </div>
  );
}
