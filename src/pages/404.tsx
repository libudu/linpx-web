import { ContentNavbar } from '@/components/Navbar';
import LinpicioConfuseImg from '@/assets/linpicio/confuse.jpg';
import { history } from 'umi';

export default function IndexPage() {
  document.title = 'Linpx - 404';
  return (
    <div>
      <ContentNavbar backTo="/">错误 404</ContentNavbar>
      <div className="flex flex-col items-center" style={{ marginTop: '40%' }}>
        <div>你来到了一片没有猫猫的荒原</div>
        <img
          className="rounded-2xl my-4"
          style={{ width: '30%' }}
          src={LinpicioConfuseImg}
        />
        <div
          className="bg-linpx py-1 px-2 rounded-lg w-max"
          onClick={() => history.push('/')}
        >
          返回首页
        </div>
      </div>
    </div>
  );
}
