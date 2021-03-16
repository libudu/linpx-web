import { Toast } from 'antd-mobile';

const fakeEle: any = document.createElement('textArea');
document.body.append(fakeEle);
fakeEle.style.position = 'fixed';
fakeEle.style.top = '-9999px';

export function copyText(text: string) {
  fakeEle.value = text;
  fakeEle.select();
  return document.execCommand('copy');
}

export function copyTextAndToast(
  text: string,
  toast: string = '复制成功！\n快分享给朋友吧！',
  failToast: string = '复制失败',
) {
  const r = copyText(text);
  if (r) {
    Toast.success(toast, 1);
  } else {
    Toast.fail(failToast, 1);
  }
}
