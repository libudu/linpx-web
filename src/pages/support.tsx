import AfdianImg from '@/assets/icon/afdian.png';

export default function IndexPage() {
  return (
    <div className="text-center py-12">
      <div className="text-2xl">LINPX的爱发电</div>
      <div className="text-xs mt-1 opacity-60">
        服务器运维…开发成本…无料周边…
      </div>
      <div className="flex justify-center mt-4 mb-2">
        <div
          className="mb-4 bg-purple-500 rounded-full w-28 h-28 flex items-center justify-center"
          style={{
            boxShadow: '0 6px 24px #777',
          }}
          onClick={() => window.open('https://afdian.net/@LINPX')}
        >
          <img src={AfdianImg} />
        </div>
      </div>
      <div className="text-sm opacity-80">
        <div>所有赞助者将被</div>
        <div>记载于开源地址的readme中</div>
      </div>
      <div className="text-xs line-through opacity-25">
        设计师先躺了，所以先程序糊一下后面再找设计要稿子做更好看的
      </div>
    </div>
  );
}
