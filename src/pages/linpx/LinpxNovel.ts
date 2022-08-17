import {
  ChoiceNode,
  JumpLabelNode,
  LabelNode,
  NodeType,
  parseText,
  TextNode,
} from './nodeParser';

export type IShowChoice = (choiceList: string[]) => Promise<number>;
export type IShowText = (text: string) => Promise<void>;

type NodeHandler = (node: any) => Promise<any>;

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

  nodeHandlerMap: Record<NodeType['type'], NodeHandler | null> = {
    text: async (node: TextNode) => await this.showText(node.text),
    start: null,
    end: async () => (this.nodeIndex = this.nodeList.length),
    label: null,
    jumpLabel: async (node: JumpLabelNode) => this.jumpToLabel(node.labelName),
    choice: async (node: ChoiceNode) => {
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
    // 解析节点，从开始标签开始
    const nodeList = parseText(text);
    const startIndex = nodeList.findIndex((node) => node.type == 'start');
    if (startIndex != -1) {
      nodeList.splice(0, startIndex + 1);
    }
    this.nodeList = nodeList;
    console.log('nodeList', nodeList);
    // 构造标签字典
    const labelNodeList = nodeList.filter(
      (node) => node.type == 'label',
    ) as LabelNode[];
    labelNodeList.forEach((labelNode) => {
      if (this.labelNameMap[labelNode.labelName]) {
        console.error('标签名重复！');
      } else {
        this.labelNameMap[labelNode.labelName] = labelNode;
      }
    });
  }

  jumpToLabel = (targetLabelName: string) => {
    const targetLabel = this.labelNameMap[targetLabelName];
    if (!targetLabel) {
      console.error(`跳转的目标标签${targetLabelName}不存在`);
    } else {
      this.nodeIndex = this.nodeList.indexOf(targetLabel);
    }
  };

  start = async () => {
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
      const handler = this.nodeHandlerMap[node.type];
      if (handler) {
        await handler(node);
      }
    }
    await this.showText('-----结束-----');
  };
}
