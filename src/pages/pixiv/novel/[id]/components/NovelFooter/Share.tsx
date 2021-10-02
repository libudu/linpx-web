import { useState } from 'react';
import { Radio } from 'antd';
import { INovelInfo } from '@/types';
import { copyTextAndToast } from '@/utils/clipboard';

const linkTypeList = [
  {
    name: 'QQ内点开',
    link: (id: string) => `http://202.182.102.21/pn/${id}`,
  },
  {
    name: '游览器链接1',
    link: (id: string) => `https://linpx.linpicio.com/pn/${id}`,
  },
  {
    name: '游览器链接2',
    link: (id: string) => `http://furrynovel.xyz/pn/${id}`,
  },
  {
    name: 'pixiv链接',
    link: (id: string) => `https://pixiv.net/novel/show.php?id=${id}`,
  },
];

const contentTypeList: {
  name: string;
  content: (props: { novelInfo: INovelInfo; link: string }) => string;
}[] = [
  {
    name: '简介链接',
    content: ({ novelInfo: { userName, title }, link }) =>
      `我正在看${userName}创作的《${title}》一起来看吧！\n${link}`,
  },
  {
    name: '纯链接',
    content: ({ link }) => link,
  },
  {
    name: '介绍链接',
    content: ({ novelInfo: { title, content, userName, tags }, link }) =>
      `《${title}》 ${content.length}字\n作者：${userName}\n标签：${tags
        .slice(0, 7)
        .join(' ')}\n链接：${link}`,
  },
];

const ItemBox: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div className="px-4">
      <div>{title}</div>
      <div className="pl-4">{children}</div>
    </div>
  );
};

const NovelShare: React.FC<{ novelInfo: INovelInfo }> = ({ novelInfo }) => {
  const { id } = novelInfo;

  const [contentTypeIndex, setContentTypeIndex] = useState(0);
  const [linkTypeIndex, setLinkTypeIndex] = useState(0);

  const linkType = linkTypeList[linkTypeIndex];
  const link = linkType.link(id);

  const contentType = contentTypeList[contentTypeIndex];
  const linkContent = contentType.content({ novelInfo, link });

  return (
    <div
      className="w-full h-full relative z-20 flex items-center"
      style={{ pointerEvents: 'none' }}
    >
      <div className="text-lg w-full bg-white" style={{ pointerEvents: 'all' }}>
        <div
          className="text-center font-bold text-2xl p-2"
          style={{ borderBottom: '1px solid #bbb' }}
        >
          分享小说
        </div>

        <div className="py-3">
          <ItemBox title="链接预览">
            <div
              className="text-sm pb-4"
              style={{ whiteSpace: 'break-spaces' }}
            >
              {linkContent}
            </div>
          </ItemBox>

          <ItemBox title="链接内容">
            <Radio.Group
              size="large"
              onChange={(e) => setContentTypeIndex(e.target.value)}
              value={contentTypeIndex}
            >
              {contentTypeList.map(({ name }, index) => (
                <Radio value={index} key={name}>
                  {name}
                </Radio>
              ))}
            </Radio.Group>
          </ItemBox>

          <ItemBox title="链接类型">
            <Radio.Group
              size="large"
              onChange={(e) => setLinkTypeIndex(e.target.value)}
              value={linkTypeIndex}
            >
              {linkTypeList.map(({ name }, index) => (
                <Radio className="w-5/12" value={index} key={name}>
                  {name}
                </Radio>
              ))}
            </Radio.Group>
          </ItemBox>

          <div className="flex justify-center pt-2">
            <div
              className="bg-linpx-orange text-xl font-bold rounded-full py-1 px-6 text-center"
              onClick={() => copyTextAndToast(linkContent)}
            >
              复制链接
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelShare;
