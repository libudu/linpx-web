import AfdianImg from '@/assets/icon/afdian.png';
import BlackLogoPng from '@/assets/logo/black_logo.png';
import WordLogoPng from '@/assets/logo/word_logo.png';

export default function IndexPage() {
  return (
    <div className="text-center py-12">
      <div className="flex flex-col items-center text-base">
        <img className="w-20" src={BlackLogoPng}></img>
        <img className="w-28 mr-2 mb-1 mt-2" src={WordLogoPng}></img>
        <div className="text-xl">LINPX IS NOT PIXIV</div>
      </div>
      <div className="flex justify-center mt-16 mb-2">
        <div
          className="mb-4 bg-purple-500 rounded-full w-24 h-24 flex items-center justify-center"
          onClick={() => window.open('https://afdian.net/@LINPX')}
        >
          <img src={AfdianImg} />
        </div>
      </div>
      <div className="font-black text-3xl">赞助我们</div>
      <div className="text-lg opacity-80 mt-2">
        <div>但赞助的并不是我们</div>
        <div>爱发电款项与本网站无关</div>
        <div>就当是在😄在💧筹</div>
        <div>我们会将您的名字记录在</div>
        <div>网站开源项目的readme中</div>
      </div>
    </div>
  );
}
