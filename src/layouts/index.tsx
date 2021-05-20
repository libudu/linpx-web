import { IRouteComponentProps, history } from 'umi';
import DrawerLayout, { getDrawerItem } from './DrawerLayout';
import { getAppWidth } from '@/utils/util';

const _his: string[] = [];
let _replace_his = '';

// 有记录路由则返回，没有历史路由则跳转到备用页面
export function goBackOrTo(path: string) {
  if (_his.length > 1) history.goBack();
  else {
    _replace_his = path;
    history.replace(path);
  }
}

export default function Layout({ children }: IRouteComponentProps) {
  const isDrawerPage = Boolean(getDrawerItem());
  // 记录下历史路由
  const path = history.location.pathname;
  const len = _his.length;
  // 啥都没有
  if (len === 0) _his.push(path);
  else if (len === 1) {
    // 有一个，且新来的和这一个不一样
    if (_his[0] !== path) _his.push(path);
  } else {
    // 新来的和最后一个一样，不变
    if (path === _his[_his.length - 1]) {
    }
    // 新来的和倒数第二个一样，表示回退，弹出倒数第一个
    else if (path === _his[_his.length - 2]) {
      _his.pop();
    }
    // 都不一样，进栈
    else _his.push(path);
  }
  if (_replace_his) {
    _replace_his = '';
    _his.pop();
    _his.pop();
    _his.push(path);
  }
  console.log(_his);

  return (
    // 最外层框架，灰色
    // 内层居中的手机，白色
    // 内层滚动层
    <div className="h-screen w-screen bg-gray-100 text-xl flex">
      <div
        className="h-screen mx-auto bg-white relative"
        style={{ width: getAppWidth() }}
      >
        <div className="h-screen w-full overflow-y-scroll overflow-x-hidden">
          {isDrawerPage ? <DrawerLayout children={children} /> : children}
        </div>
      </div>
    </div>
  );
}
