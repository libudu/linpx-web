import { history } from 'umi';

export const historyRecord: string[] = [];
let lastBackPath = '';

export function goBackOrTo(path: string) {
  if (historyRecord.length > 1) history.goBack();
  // 空降到某个页面，后退使用备用路径
  else {
    lastBackPath = path;
    history.replace(path);
  }
}

// 进入新路由
export const enterNewPath = (path: string) => {
  const len = historyRecord.length;
  // 啥都没有
  if (len === 0) historyRecord.push(path);
  else if (len === 1) {
    // 有一个，且新来的和这一个不一样
    if (historyRecord[0] !== path) historyRecord.push(path);
  } else {
    // 新来的和最后一个一样，不变
    if (path === historyRecord[historyRecord.length - 1]) {
    }
    // 新来的和倒数第二个一样，表示回退，弹出倒数第一个
    else if (path === historyRecord[historyRecord.length - 2]) {
      historyRecord.pop();
    }
    // 都不一样，进栈
    else historyRecord.push(path);
  }
  // 如果是通过goBack回退的
  if (lastBackPath) {
    lastBackPath = '';
    historyRecord.pop();
    historyRecord.pop();
    historyRecord.push(path);
  }
  console.log(historyRecord);
};
