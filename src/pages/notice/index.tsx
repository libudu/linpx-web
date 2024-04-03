import PageLayout from '@/components/PageLayout';
import React from 'react';
import { history } from 'umi';
import Stop167IpNotice from './components/167ip';
import { NovelCommentById } from '../pixiv/novel/[id]/components/NovelFooter/Comment';
import { LinpxAppNotice } from './components/linpxApp';
import CloseImg1 from '@/assets/default/close.png';

const NoticeContent: Record<
  string,
  {
    ele: React.ReactElement;
    title?: string;
    commentId?: string;
  }
> = {
  stop167ip: {
    ele: <Stop167IpNotice />,
    commentId: '1000000001',
  },
  linpxApp: {
    title: 'Linpx轻量app',
    ele: <LinpxAppNotice />,
    commentId: '1000000002',
  },
};

const Notice: React.FC = () => {
  const id = String(history.location.query?.['id']);
  const notice = NoticeContent[id];
  if (!notice) {
    history.push('/404');
    return null;
  }
  const { ele, commentId, title } = notice;
  return (
    <PageLayout title={title || '通知'} rightEle={<></>}>
      <div className="m-4 ml-3">{ele}</div>
      {commentId && <NovelCommentById isEmpty id={commentId} />}
    </PageLayout>
  );
};

export const CloseNotice = () => {
  return (
    <>
      <div className="m-4 ml-3">
        <div className="p-2">
          <div>大家好我是站长丢，很遗憾地告诉大家，Linpx 决定关站了。</div>
          <div className="mt-2">【为什么】</div>
          <div>
            对于关站的原因，不必有太多猜测，丢到目前还没有被请喝茶，Linpx
            的风评也还不错。虽然偶尔有温和的批评声，不过侥幸从未收到过特别激烈的恶评。
          </div>
          <div>
            关站主要是丢经历了一些事后，有了很多新的想法和感悟，同时 Linpx
            内在的矛盾和不自洽进一步暴露。这些矛盾在外在表现上，不管是热情消退、法律风险、用户批评、持续亏损、封号封链还是其他什么，都并不严重，都有方法解决或者妥协。但是
            Linpx
            这个作品本身的矛盾和不自洽性是无法掩盖的，丢认识到了这种无法回避无法解决的矛盾，只会导致
            Linpx
            承受越来越多的压力、无可挽回地滑向深渊。此时关站才是合适的选择。
          </div>
          <div>
            关站以后，丢当然也不会停下脚步，而是会将精力投入到其他项目中，希望能开发出其他更成熟稳定的产品。
          </div>
          <div className="mt-2">【感想】</div>
          <div className="flex justify-center my-2 rounded-sm">
            <img className="w-3/4" src={CloseImg1} />
          </div>
          <div>
            Linpx
            最初起源于一个突发奇想的主意，发展于丢在学生时代的技术成长，终结于自身最初就已注定的不成熟和不自洽性。
          </div>
          <div>
            Linpx
            承载了丢过去很多的心血和热情，有很多个日夜丢都在开发和维护这个软件，探索过各种边界，尝试过
            linpx-qqbot、linpx-word、linpx-appshell 等各种方向。
          </div>
          <div>
            Linpx
            也让丢收获了很多：积累了技术，认识了很多朋友，满足了很多虚荣心，获得了很大的自我实现的满足感，有了一个能够吐槽心声虽然不一定有人看的地方。这些也是支持着
            Linpx 这个既有很大风险也注定亏损的项目坚持到今天的原因。
          </div>
          <div className="mt-2">【我还想看小说怎么办】</div>
          <div>
            Linpx 中的所有推荐作者的名称和对应的 pixiv id，目前可以通过
            <a
              className="text-blue-500 hover:text-blue-500"
              href="https://linpxapi.linpicio.com/fav/user"
              target="_blank"
            >
              这个链接
            </a>
            获取 json
            文件。大家可以自行关注这些作者，他们的产出才是一切的源头。后续也会给出可读性更高的作者名称和对应
            pixiv 链接的对照界面。
          </div>
          <div>
            虽然 Linpx
            关站了，但是作为开源项目，有兴趣且有技术力的小伙伴可以通过 Github
            上的
            <a
              className="text-blue-500 hover:text-blue-500"
              href="https://github.com/libudu/linpx-web"
              target="_blank"
            >
              开源项目
            </a>
            自己部署一个自己的 Linpx
            并进行后续开发。后续有空的话也会将完整的最新的 Linpx
            前后端进行开源。
          </div>
          <div>
            如果有重要数据保存在 Linpx
            上（连账号都没有应该不会有啥重要数据吧），可以联系丢通过后台获取这些数据。
          </div>
          <div>【再见】</div>
          <div>
            山水一程，三生有幸。感谢所有为 Linpx
            做出贡献的参与者，感谢每一个橘猫群里的小伙伴，感谢每一个 Linpx
            的用户。
          </div>
        </div>
      </div>
      <NovelCommentById isEmpty id="1000000003" />
    </>
  );
};

export default Notice;
