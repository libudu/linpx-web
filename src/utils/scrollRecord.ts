import { RefObject, useEffect } from 'react';
import { history } from 'umi';

// 记录页面滚动位置
const posMap: Record<string, number> = {};
(window as any).posMap = posMap;

// 将元素滚动到指定位置
export const eleScrollToPos = (ele: HTMLElement | null, pos: number) => {
  if (!ele) {
    return;
  }
  // 夸克浏览器上，不套setTimeout将无法滚动到位置
  let count = 0;
  let timer = setInterval(() => {
    // 可能之前的页面还没渲染出来
    let totalHeight = 0;
    [...ele.children].forEach((ele) => (totalHeight += ele.clientHeight));
    // 最多等待2000ms页面加载出来
    if (totalHeight < pos && count < 20) {
      count += 1;
    } else {
      clearInterval(timer);
      ele.scrollTo({ top: pos });
    }
  }, 100);
};

// 路由返回时自动滚动到上次记录的位置的位置
export const useRecordLastScroll = (ref: RefObject<any>, deps: any[] = []) => {
  useEffect(() => {
    const node = ref.current;
    if (node) {
      const path = history.location.pathname;
      const lastPos = posMap[path];
      // 上次位置存在则滚过去
      if (lastPos && history.action === 'POP') {
        eleScrollToPos(node, lastPos);
      }
      // 添加滚动监听
      const handler = (e: Event) => {
        // 上面组件里获取到的path会有延迟
        const path = history.location.pathname;
        posMap[path] = node.scrollTop;
      };
      node.addEventListener('scroll', handler);
      return () => node.removeEventListener('scroll', handler);
    }
  }, deps);
};
