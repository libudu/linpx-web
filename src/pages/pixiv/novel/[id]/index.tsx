import { useState, ReactElement } from 'react';
import { IRouteProps } from 'umi';
import classNames from 'classnames';

import { ContentNavbar } from '@/components/Navbar';
import { proxyImg, t2s } from '@/utils/util';
import { useFavUserById, usePixivNovel } from '@/api';

import { AfdianButton } from '../../../components/Afdian';
import NovelIntro from './components/NovelIntro';
import NovelNavbar from './components/NovelNavbar';
import { INovelInfo } from '@/types';
import { useCallback } from 'react';
import { throttle } from 'lodash';

export let updateNovelStyle: any;
export let novelStyle = {
  fontFamily: '',
  fontSizeClass: '',
  bgColor: '',
  color: '#000',
};

const processContent = (
  text: string,
  images: INovelInfo['images'] | undefined,
) => {
  // 繁简转换
  const testText = text.slice(0, 50);
  if (testText !== t2s(testText)) {
    console.log('正文自动繁体转换');
    text = t2s(text);
  }
  // 去除[newpage]
  text = text.replaceAll('[newpage]', '');
  // 渲染图片列表
  if (images) {
    let splitText = text.split(/\[uploadedimage:(\d*)\]/);
    let childrenList: ReactElement[] = [];
    splitText.forEach((text, index) => {
      // 图片id
      if (index % 2) {
        const img = images[text];
        childrenList.push(
          <img
            key={index}
            className="w-full rounded-xl"
            src={proxyImg(img.preview)}
          />,
        );
        // 普通内容
      } else {
        if (text) {
          childrenList.push(<div key={index}>{text}</div>);
        }
      }
    });
    return childrenList;
  }
  return text;
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

  // 监听滚动
  const [showNavbar, setShowNavbar] = useState(true);

  const scrollHandler = useCallback(
    throttle((e: any) => {
      const scrollTop: number = e.target.scrollTop;
      const shake = 20;
      const change = scrollTop - lastScrollTop;
      // 上滑
      if (change < -shake || scrollTop < 60) {
        setShowNavbar(true);
        // 下滑
      } else if (change > shake) {
        setShowNavbar(false);
      }
      lastScrollTop = scrollTop;
    }, 100),
    [],
  );

  if (!novelInfo) {
    return <ContentNavbar>小说详情</ContentNavbar>;
  }

  const { content, userName, images } = novelInfo;

  return (
    <div className="h-screen w-full overflow-y-scroll" onScroll={scrollHandler}>
      <NovelNavbar showNavbar={showNavbar} novelInfo={novelInfo} />
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
            {processContent(content, images)}
          </div>
          {afdianUrl && <AfdianButton url={afdianUrl} user={userName} />}
        </div>
      )}
    </div>
  );
}
