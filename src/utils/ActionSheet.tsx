import { ActionSheet } from 'antd-mobile';
import { history } from 'umi';
// 复制链接
// 查看原页面

export default function MyActionSheet() {
  const BUTTONS = ['复制链接', '查看原网页', '返回'];
  ActionSheet.showActionSheetWithOptions(
    {
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length - 1,
      maskClosable: true,
    },
    (buttonIndex: any) => {
      console.log(buttonIndex);
    },
  );
}
