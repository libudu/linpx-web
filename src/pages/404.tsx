import { ContentNavbar } from '@/components/Navbar';
import LinpicioConfuseImg from '@/assets/linpicio/confuse.jpg';
import HeaderLogoPNG from '@/assets/icon/logo.png';
import { history } from 'umi';

export default function IndexPage() {
  document.title = 'Linpx - 404';
  return (
    <div>
      <ContentNavbar backTo="/" rightEle=" ">
        <img className="h-8" src={HeaderLogoPNG} />
      </ContentNavbar>
      <div className="flex flex-col items-center" style={{ marginTop: '25vh' }}>
        <img
          className="rounded-2xl"
          style={{ width: '30vw' }}
          src={LinpicioConfuseImg}
        />
        <div className="font-black text-3xl my-3">错误 - 404</div>
        <div className="mb-3">你来到了没有猫猫的荒原</div>
        <div
          className="bg-linpx py-1.5 px-4 rounded-lg w-max font-black"
          onClick={() => history.push('/')}
        >
          返回首页
        </div>
      </div>
    </div>
  );
}
