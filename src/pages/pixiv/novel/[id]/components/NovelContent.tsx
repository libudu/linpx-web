import { ReactElement } from 'react';
import { proxyImg, t2s } from '@/utils/util';
import { INovelInfo } from '@/types';

interface NovelContentProps {
  text: string;
  images: INovelInfo['images'] | undefined;
}

const NovelContent: React.FC<NovelContentProps> = ({ text, images }) => {
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
    return <>{childrenList}</>;
  }
  return <>{text}</>;
};

export default NovelContent;
