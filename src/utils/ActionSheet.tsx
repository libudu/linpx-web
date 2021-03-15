import { ActionSheet, Toast } from 'antd-mobile';
import copyText from './clipboard';

// 复制链接
// 查看原页面

export interface IAction {
  name: string;
  action: any;
}

export const copyHrefAction = {
  name: '复制链接',
  action: () => {
    const r = copyText(window.location.href);
    if (r) {
      Toast.success('复制成功！\n快分享给朋友吧！', 1);
    } else {
      Toast.fail('复制失败', 1);
    }
  },
};

export const cancelAction = {
  name: '取消',
  action: () => {},
};

export const defaultActions = [copyHrefAction, cancelAction];

export default function MyActionSheet(actions: IAction[] = defaultActions) {
  const names = actions.map((ele) => ele.name);
  ActionSheet.showActionSheetWithOptions(
    {
      options: names,
      cancelButtonIndex: names.length - 1,
      maskClosable: true,
    },
    (buttonIndex: any) => {
      console.log(buttonIndex);
      actions[buttonIndex].action();
    },
  );
}
