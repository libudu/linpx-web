/**
 * 进入网站时检测，如果是167访问，给一个提示和跳转到通知的弹窗
 * */

const Stop167IpNotice: React.FC = () => {
  return (
    <div>
      <div className="text-center font-bold text-2xl mb-2">
        关于本站ip访问方式停用的通知
      </div>
      <div className="font-bold">省流版</div>
      <div>
        linpx的ip(<span>167.179.105.30</span>
        )即将停用，请使用该ip访问本网站的用户通过
        <a href="http://furrynovel.xyz">furrynovel.xyz</a>或
        <a href="https://linpx.linpicio.com">linpx.linpicio.com</a>
        访问本站。
      </div>
      <div className="font-bold mt-2">详细版</div>
      <div>
        <div>
          1、一直以来，linpx有furrynovel.xyz、linpx.linpicio.com两个主要域名。
        </div>
        <div>
          2、由于QQ的审查和屏蔽，在QQ中发送linpx链接会提示危险网站，并且无法直接点开，必须要复制到游览器才能打开。之前希望可以通过不断更换ip的方法避开这种屏蔽，达到可以在QQ中直接点开访问linpx的目的。
        </div>
        <div>
          3、但是所有使用过的ip还是逐个被封了，加上vultr服务商提供的ip是并非随机而是固定的，难以申请到新的没被封禁的ip。所以以后linpx不打算通过这种方式绕过QQ的屏蔽，ip访问也就失去了意义。
        </div>
        <div>
          4、根据访问记录，最近一个月大概有7%的请求量还在用167.179.105.30访问本站。本站的ip访问方式最早在2月1日就会停用，请通过另外两个域名访问。
        </div>
      </div>
    </div>
  );
};

export default Stop167IpNotice;
