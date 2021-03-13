const fakeEle: any = document.createElement('textArea');
document.body.append(fakeEle);
fakeEle.style.position = 'fixed';
fakeEle.style.top = '-9999px';

export default function copyText(text: string) {
  fakeEle.value = text;
  fakeEle.select();
  return document.execCommand('copy');
}
