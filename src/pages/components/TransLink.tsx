import { InputItem, Toast } from 'antd-mobile';
import { copyTextAndToast } from '@/utils/clipboard';
import { useState } from 'react';
import gtag from '@/utils/gtag';

const linkTypeInfo = [
  {
    type: 'novel',
    regex: /https:\/\/www.pixiv.net\/novel\/show.php\?id=(\d*)/,
    result: 'https://linpx.linpicio.com/pixiv/novel/{data}',
  },
  {
    type: 'user',
    regex: /https:\/\/www.pixiv.net\/users\/(\d*)/,
    result: 'https://linpx.linpicio.com/pixiv/user/{data}',
  },
];

export function transformLink(link: string): string {
  if (!link) return '';
  for (let linkType of linkTypeInfo) {
    const matchResult = link.match(linkType.regex);
    if (matchResult && matchResult[1]) {
      return linkType.result.replace('{data}', matchResult[1]);
    }
  }
  return '';
}

function Box({ children }: { children: any }) {
  return (
    <div
      className="lp-shadow bg-white h-10 my-4 flex items-center overflow-hidden"
      style={{ borderRadius: '9999px' }}
      children={children}
    />
  );
}

export default function TransLink() {
  const [copyText, setCopyText] = useState('');
  return (
    <div className="py-2 px-4 w-full">
      <Box>
        <InputItem
          className="w-full"
          clear
          placeholder="粘贴 Pixiv 链接"
          onChange={(text) => setCopyText(transformLink(text))}
        />
      </Box>

      <Box>
        <div className="w-full flex">
          <div style={{ width: '70%' }}>
            <InputItem
              editable={false}
              clear
              placeholder="LINPX 链接"
              value={copyText}
            />
          </div>
          <div
            className="flex justify-center items-center bg-yellow-400 text-white font-bold"
            style={{ width: '30%' }}
            onClick={() => {
              gtag('event', 'share', {
                content_type: 'link',
                content_id: copyText,
              });
              if (copyText) {
                copyTextAndToast(copyText);
              } else {
                Toast.show('输入有效链接再粘贴喵~', 1);
              }
            }}
          >
            复制
          </div>
        </div>
      </Box>
    </div>
  );
}
