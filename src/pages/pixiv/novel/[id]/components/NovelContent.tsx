import { ReactElement } from 'react';
import { proxyImg, t2s } from '@/utils/util';
import { INovelInfo } from '@/types';
import { useModel } from 'umi';
import classNames from 'classnames';
import LinpxNovelWidget from '@/pages/linpx/components/LinpxNovelWidget';

interface NovelContentProps {
  text: string;
  images: INovelInfo['images'] | undefined;
  isLinpxNovel?: boolean;
}

const NovelContent: React.FC<NovelContentProps> = ({
  text,
  images,
  isLinpxNovel,
}) => {
  // 繁简转换
  const testText = text.slice(0, 50);
  if (testText !== t2s(testText)) {
    text = t2s(text);
  }
  if (isLinpxNovel) {
    return <LinpxNovelWidget text={text} />;
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

export default (props: NovelContentProps) => {
  const { novelStyles } = useModel('styles');
  return (
    <div
      className={classNames(
        'whitespace-pre-line p-4 w-full',
        novelStyles.fontSizeClass,
      )}
      style={{
        background: novelStyles.bgColor,
        color: novelStyles.color,
        fontFamily: novelStyles.fontFamily,
      }}
    >
      <NovelContent {...props} />
    </div>
  );
};
