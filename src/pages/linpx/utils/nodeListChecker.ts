import LinpxNovel from './LinpxNovel';
import {
  CloseSettingNode,
  JumpLabelNode,
  LabelNode,
  NodeType,
  OpenSettingNode,
} from './nodeParser';

export const checkNodeList = (nodeList: NodeType[]) => {
  let errorInfoList: string[] = [];
  // 检测标签节点是否重复
  const labelNodeList = nodeList.filter(
    ({ type }) => type == 'label',
  ) as LabelNode[];
  const labelNameMap: Record<string, LabelNode> = {};
  labelNodeList.forEach((labelNode) => {
    if (labelNameMap[labelNode.labelName]) {
      errorInfoList.push(`标签名【${labelNode.labelName}】重复！`);
    } else {
      labelNameMap[labelNode.labelName] = labelNode;
    }
  });
  // 跳转节点是否存在
  const jumpLabelNodeList = nodeList.filter(
    ({ type }) => type == 'jumpLabel',
  ) as JumpLabelNode[];
  jumpLabelNodeList.forEach((jumpLabelNode) => {
    if (!labelNameMap[jumpLabelNode['labelName']]) {
      errorInfoList.push(`要跳转的标签【${jumpLabelNode.labelName}】不存在`);
    }
  });
  // 检测开启关闭是否不合法
  const settingNodeList = nodeList.filter(
    ({ type }) => type === 'openSetting' || type == 'closeSetting',
  ) as (OpenSettingNode | CloseSettingNode)[];
  const settingStateList = Object.keys(LinpxNovel.settingState);
  settingNodeList.forEach((node) => {
    if (!settingStateList.includes(node.settingName)) {
      errorInfoList.push(`开启/关闭设置中不支持【${node.settingName}】`);
    }
  });
  return errorInfoList;
};
