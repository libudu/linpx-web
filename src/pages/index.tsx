import { Link } from 'umi';

export default function IndexPage() {
  return (
    <div className="text-center">
      <div>一个封面</div>
      <Link to="/pixiv/recommend/users">推荐作者</Link>
      <div>最新小说</div>
      <div>转链功能</div>
    </div>
  );
}
