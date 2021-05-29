import AfdianImg from '@/assets/icon/afdian.png';

interface AfdianButtonProps {
  url: string;
}

const AfdianButton: React.FC<AfdianButtonProps> = ({ url }) => {
  return (
    <div className="flex flex-col items-center my-4">
      <div
        className="mb-4 bg-purple-500 rounded-full w-28 h-28 flex items-center justify-center"
        style={{
          boxShadow: '0 6px 24px #777',
        }}
        onClick={() => window.open(url)}
      >
        <img src={AfdianImg} />
      </div>
      <div className="mb-1 text-2xl font-bold leading-5">支持作者</div>
      <div className="text-purple-500 text-base">爱发电赞助</div>
    </div>
  );
};

export default AfdianButton;
