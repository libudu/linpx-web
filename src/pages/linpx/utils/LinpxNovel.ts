import { ITextInfo } from '../components/LinpxNovelWidget';
import { checkNodeList } from './nodeListChecker';
import {
  ChoiceNode,
  LabelNode,
  NodeType,
  NodeTypeMap,
  parseText,
  TextNode,
} from './nodeParser';

export type IShowChoice = (choiceList: string[]) => Promise<number>;
export type IShowText = (textInfo: ITextInfo) => Promise<void>;
export type NovelSettingType = keyof LinpxNovel['settingState'];

export default class LinpxNovel {
  // 节点解析相关
  nodeList: NodeType[] = [];
  labelNameMap: Record<string, LabelNode> = {};

  // 外部传入的回调函数
  showChoice: IShowChoice;
  showText: IShowText;
  clearText: () => void;

  // 运行时变量
  choiceStack: ChoiceNode[] = [];
  nodeIndex = 0;
  notBlockCount = 0;
  static settingState = {
    结尾按钮: true, // 结尾是否显示分割线和重新开始按钮
    合并相邻文本: false, // 相邻的文本节点合并为一个节点
  };
  settingState = { ...LinpxNovel.settingState };

  // 配置信息
  // 会产生阻塞效果的节点
  blockNodeType: NodeType['type'][] = ['text', 'choice'];

  // 节点处理器：type为键，值是节点的处理函数，该函数传入该类型的节点
  nodeHandlerMap: {
    [T in NodeType['type']]: ((node: NodeTypeMap[T]) => Promise<any>) | null;
  } = {
    text: async (node) => await this.showText({ text: node.text }),
    start: null,
    end: async () => (this.nodeIndex = this.nodeList.length),
    label: null,
    jumpLabel: async (node) => this.jumpToLabel(node.labelName),
    choice: async (node) => {
      // 探测下一个节点是不是选项，是则添加到栈，不是则将栈中所有选项作为选项组显示
      this.choiceStack.push(node);
      const nextNode = this.nodeList[this.nodeIndex + 1];
      if (!nextNode || nextNode.type != 'choice') {
        const choiceList = this.choiceStack.map((i) => i.text);
        const chosenIndex = await this.showChoice(choiceList);
        // 选择了某个选项，如果该选项有跳转则跳转到对应位置
        const { onClickNode } = this.choiceStack[chosenIndex];
        // 完成了选择，清空选项组
        this.choiceStack = [];
        if (onClickNode) {
          this.jumpToLabel(onClickNode.labelName);
        }
      }
    },
    clear: async () => this.clearText(),
    openSetting: async ({ settingName }) =>
      this.settingState[settingName] !== undefined &&
      (this.settingState[settingName] = true),
    closeSetting: async ({ settingName }) =>
      this.settingState[settingName] !== undefined &&
      (this.settingState[settingName] = false),
  };

  static checkText = (text: string) => {
    const nodeList = parseText(text);
    return checkNodeList(nodeList);
  };

  constructor({
    text,
    showText,
    showChoice,
    clearText,
  }: {
    text: string;
    showText: IShowText;
    showChoice: IShowChoice;
    clearText: () => void;
  }) {
    this.showText = showText;
    this.showChoice = showChoice;
    this.clearText = clearText;
    // 解析节点，从【开始】节点开始
    const nodeList = parseText(text);
    const startIndex = nodeList.findIndex((node) => node.type == 'start');
    if (startIndex != -1) {
      nodeList.splice(0, startIndex + 1);
    }
    this.nodeList = nodeList;
    // 构造标签字典
    const labelNodeList = nodeList.filter(
      (node) => node.type == 'label',
    ) as LabelNode[];
    labelNodeList.forEach((labelNode) => {
      // 编译时错误：标签名重复
      if (this.labelNameMap[labelNode.labelName]) {
        console.error('标签名重复！');
      } else {
        this.labelNameMap[labelNode.labelName] = labelNode;
      }
    });
  }

  jumpToLabel = (targetLabelName: string) => {
    const targetLabel = this.labelNameMap[targetLabelName];
    if (targetLabel) {
      this.nodeIndex = this.nodeList.indexOf(targetLabel);
    }
  };

  start = async () => {
    // 初始化置空
    this.choiceStack = [];
    this.nodeIndex = 0;
    this.notBlockCount = 0;
    let lastTextNode: TextNode | null = null;
    // 开始执行
    for (
      this.nodeIndex = 0;
      this.nodeIndex < this.nodeList.length;
      this.nodeIndex++
    ) {
      const node = this.nodeList[this.nodeIndex];
      // 所有节点遍历完
      if (!node) {
        break;
      }
      // 检查节点是否处于循环
      const isInLoop = this.checkNodeInLoop(node);
      if (isInLoop) return;
      // 执行节点的处理函数
      const handler = this.nodeHandlerMap[node.type];
      if (handler) {
        // 合并相邻文本
        if (this.settingState['合并相邻文本']) {
          // 碰到文本节点不执行而是累积，到下一个非文本节点再一次执行
          if (node.type === 'text') {
            if (lastTextNode === null) {
              // 不能直接引用，避免多次start时污染节点
              lastTextNode = { ...node };
            } else {
              lastTextNode.text += node.text;
            }
          }
          // 处理上一个没处理的文本节点
          else {
            if (lastTextNode !== null) {
              const handler = this.nodeHandlerMap.text;
              await handler?.(lastTextNode);
              lastTextNode = null;
            }
            await handler(node as any);
          }
        }
        // 不合并，每个节点逐个执行
        else {
          await handler(node as any);
        }
      }
    }
    // 小说结束
    this.novelEnd();
  };

  checkNodeInLoop = (node: NodeType) => {
    // 合并文本节点不会死循环，所以这里不会有影响
    // 是阻塞节点则计数清零，否则递增
    if (this.blockNodeType.includes(node.type)) {
      this.notBlockCount = 0;
    } else {
      this.notBlockCount++;
    }
    // 连续碰到100个非阻塞节点，报错
    if (this.notBlockCount > 200) {
      alert('连续碰到超过200个非阻塞节点，请告知作者检查文本是否存在死循环！');
      return true;
    }
    return false;
  };

  novelEnd = async () => {
    // 结尾分割线和按钮
    if (this.settingState['结尾按钮']) {
      await this.showText({
        text: '----------------------- 结 束 -----------------------',
        style: { textAlign: 'center' },
      });
      await this.showChoice(['重新开始']);
      this.clearText();
      this.start();
    }
  };
}
