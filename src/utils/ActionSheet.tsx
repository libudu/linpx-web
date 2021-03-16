import { ActionSheet, Toast } from 'antd-mobile';
import { copyText, copyTextAndToast } from './clipboard';

// 复制链接
// 查看原页面

export interface IAction {
  name: string;
  action: any;
}

export const copyHrefAction = {
  name: '复制链接',
  action: () => {
    copyTextAndToast(window.location.href);
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
