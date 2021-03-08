import { Link } from 'umi';

export default function IndexPage() {
  return (
    <div>
      <div className="px-4 text-center text-4xl">Linpx</div>
      <Link to="/pixiv/recommend/users">推荐作者</Link>
    </div>
  );
}
