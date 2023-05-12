import AppLogoImg from '@/assets/logo/app_logo.png';

const qaList = [
  {
    q: '不是说不做 app 吗？',
    a: (
      <>
        <span className="line-through">
          你说得对，但是 LINPX
          是由林彼丢自主研发的一款全新兽人小说在线阅读网站……
        </span>
        <div>
          本来是不打算做的，但是许多国产安卓手机游览器屏蔽了 linpx
          的网址，严重影响了用户体验。这个 App 正是给更喜欢使用 App 或者游览器中
          linpx 被屏蔽的用户提供一个额外的选择。
        </div>
        <div>
          另外在linpx链接被 QQ 全面屏蔽后，分享 Linpx App
          也算是一种不错的传播方法。欢迎大家分享给自己的朋友！这对 Linpx
          很有帮助！
        </div>
      </>
    ),
  },
  {
    q: '那这不就是一个游览器 / webview 套壳 app 吗？',
    a: '完全正确！并且这就是 Linpx App 的定位。',
  },
  {
    q: '有考虑针对 App 端做更多功能的定制开发吗？',
    a: '目前不考虑。',
  },
  {
    q: '有考虑开发 IOS 平台的应用吗？',
    a: '暂时不考虑。因为站长手里没有果子手机用来调试，果子系统的应用安装更加严格，并且 Safari 游览器目前还没有拦截 Linpx 的域名，可以正常通过浏览器访问。',
  },
];

export const LinpxAppNotice = () => {
  return (
    <div>
      <div>Linpx 最新上线了安卓端的 App！</div>
      <div>特性：</div>
      <ul className="relative -left-3 mb-2">
        <li>
          完全开源，
          <span
            className="text-blue-400"
            onClick={() =>
              window.open('https://github.com/libudu/linpx-appshell')
            }
          >
            Github 链接
          </span>
        </li>
        <li>和网页端几乎完全一致的用户体验！（因为就是在 App 里打开网页）</li>
        <li>去除了所有能够去除的所有模块和权限！</li>
        <li className="line-through">
          妈妈再也不用担心我被扒通讯录的恶意 App 勒索了！
        </li>
        <li>安装包达到了惊人的 4M 大小！</li>
        <li>更新不需要下载安装包，网页端的变化随时同步！</li>
      </ul>
      <div className="my-3 flex justify-center">
        <div
          className="flex items-center"
          onClick={() => window.open('/resource/Linpx安卓版.apk')}
        >
          <img className="w-16 h-16 mr-2" src={AppLogoImg} />
          <div className="text-blue-400 font-bold text-2xl">点击下载</div>
        </div>
      </div>
      <div>
        我知道你有很多疑问，别急，一条条来
        {qaList.map(({ q, a }) => (
          <div key={q}>
            <div>
              <span className="font-bold">Q</span>：{q}
            </div>
            <div>
              <span className="font-bold">A</span>：{a}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
