import { Accordion } from 'antd-mobile';
const { Panel } = Accordion;

interface QAItem {
  q: string;
  a: JSX.Element | string;
}

const qaList: QAItem[] = [
  {
    q: 'LINPX的设计思想是什么？',
    a:
      'LINPX追求的是尽可能的简单、短平快。\n理想的应用场景是：\n群友看到好文，分享链接，点开即阅，阅完即走；\n对于找寻优质作者、小说能轻松、快速地搜索到。',
  },
  {
    q: 'LINPX开发者有哪些？',
    a:
      '站长：林彼丢\n设计：apoto5\n协助：V.C\n顾问：空狼\n欢迎更多擅长react前端、node后端、网页设计、有建设意见的朋友一起助力linpx！',
  },
  {
    q: '有考虑做成app吗？',
    a:
      '事实上，LINPX早期并非网站，而是一个投入了大量时间、几乎快完成的app。\n（开源地址：https://github.com/libudu/linpx-app，已废弃）。\n但是相对于“点开即阅”的网站，需要下载、安装、更新的app还是太过笨重了，不符合“短平快”的初衷。\n还有一些其他技术栈等原因，所以废弃了app项目。',
  },
  {
    q: '为什么分享的时候有2个链接？',
    a:
      'LINPX有两个域名，分别是：\nhttps://linpx.linpicio.com\nhttp://furrynovel.xyz\n一般情况两个域名都能正常使用。\n其中第一个域名更长但更正式，后来发现QQ拦截了第一个域名。',
  },
  {
    q: '为什么我好像不开VPN连不上？',
    a:
      '由于内容特殊性，LINPX的服务器和域名都在国外。\n大部分地区能够正常访问，但是站长工具的ping测试结果显示总是有一些区域无法连接。\n虽然做了一些补救措施，但问题仍存在。\n欢迎加群反馈所在地区，以供更好统计测试。',
  },
  {
    q: '如何成为推荐作者？有什么条件吗？',
    a:
      '首先需要有一个发表了数篇小说（越多越好）的pixiv账号，然后加qq群576268549反馈即可。',
  },
  {
    q: '推荐作者是怎么排序的？',
    a:
      '当前是随机排序，每天0点刷新。\n（以前是每次加载网页都随机排列，有用户反馈刷新太快体验不太好）',
  },
  {
    q: '为什么有的作者有爱发电图标而我没有？',
    a:
      '爱发电图标是新增的功能，任何推荐作者都可联系站长添加。\n总之：\n1、是推荐作者\n2、有爱发电账号\n3、加qq群576268549反馈添加',
  },
  {
    q: 'LINPX与pixiv的关系是什么样的？',
    a:
      '早期LINPX的后端仅提供代理pixiv请求的功能，没有自建数据库。\n后来逐渐拓展出一些处理并增强pixiv数据的功能，可以将LINPX理解为建立在pixiv上的一个垂直领域定制服务。\n再后来逐渐加上了mongodb数据库，但目前也仅提供数据缓存和少量简单自建数据。',
  },
  {
    q: '为什么LINPX的有部分数据有一定延迟？',
    a:
      '如上文所说，LINPX后端做了数据缓存，有一定缓存时间和更新机制，可能存在一定延迟现象，一般最多不超过一天。',
  },
];

export default function IndexPage() {
  return (
    <Accordion>
      {qaList.map(({ q, a }) => (
        <Panel header={<div className="font-bold">{q}</div>} key={q}>
          <div className="mx-4 whitespace-pre-wrap">{a}</div>
        </Panel>
      ))}
    </Accordion>
  );
}
