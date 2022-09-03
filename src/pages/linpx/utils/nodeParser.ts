// 文本节点
export type TextNode = {
  type: 'text';
  text: string;
};

// 快速构造无参节点的解析器
const makeNoArgNodeParser = <T extends { type: string }>(
  keyWord: string,
  typeName: T['type'],
): ((line: string) => T | null) => {
  return (line: string) => {
    if (line.startsWith(`【${keyWord}】`)) {
      return { type: typeName } as any;
    }
    return null;
  };
};

// 清空节点
export type ClearNode = { type: 'clear' };
const parseClearNode = makeNoArgNodeParser<ClearNode>('清空', 'clear');

// 开始、结束节点
export type StartNode = { type: 'start' };
const parseStartNode = makeNoArgNodeParser<StartNode>('开始', 'start');

export type EndNode = { type: 'end' };
const parseEndNode = makeNoArgNodeParser<EndNode>('结束', 'end');

// 快速构造一个参数节点的解析器
const makeOneArgNodeParser = <T extends { type: string }>(
  keyWord: string,
  typeName: T['type'],
  argName: string,
): ((line: string) => T | null) => {
  return (line: string) => {
    const reg = new RegExp(`^【${keyWord} (.*)】`);
    const result = line.match(reg);
    if (result) {
      return {
        type: typeName,
        [argName]: result[1],
      } as any;
    }
    return null;
  };
};

// 标签节点
export type LabelNode = {
  type: 'label';
  labelName: string;
};
const parseLabelNode = makeOneArgNodeParser<LabelNode>(
  '标签',
  'label',
  'labelName',
);

// 跳转标签节点
export type JumpLabelNode = {
  type: 'jumpLabel';
  labelName: string;
};
const parseJumpLabelNode = makeOneArgNodeParser<JumpLabelNode>(
  '跳转标签',
  'jumpLabel',
  'labelName',
);

// 开启、关闭节点
export type OpenSettingNode = { type: 'openSetting'; settingName: string };
const parseOpenSettingNode = makeOneArgNodeParser<OpenSettingNode>(
  '开启',
  'openSetting',
  'settingName',
);

export type CloseSettingNode = { type: 'closeSetting'; settingName: string };
const parseCloseSettingNode = makeOneArgNodeParser<CloseSettingNode>(
  '关闭',
  'closeSetting',
  'settingName',
);

// 选项节点
export type ChoiceNode = {
  type: 'choice';
  text: string;
  onClickNode?: JumpLabelNode;
};

const parseChoiceNode = (line: string): ChoiceNode | null => {
  const result = line.match(/^【选项】(.*)/);
  if (result) {
    const argStr = result[1];
    const [text, onClickNodeStr] = argStr.split('【');
    // 选项标签后面跟的结果标签
    if (onClickNodeStr) {
      const onClickNode = parseJumpLabelNode('【' + onClickNodeStr);
      if (onClickNode) {
        return {
          type: 'choice',
          text,
          onClickNode,
        };
      } else {
        return {
          type: 'choice',
          text: text + '【' + onClickNodeStr,
        };
      }
    } else {
      return {
        type: 'choice',
        text,
      };
    }
  }
  return null;
};

const nodeParserList = [
  // 无参节点
  parseStartNode,
  parseEndNode,
  parseClearNode,
  // 单参节点
  parseLabelNode,
  parseJumpLabelNode,
  parseOpenSettingNode,
  parseCloseSettingNode,
  // 多项节点
  parseChoiceNode,
];

// 列表转联合
type NodeTypeUnion = typeof nodeParserList extends Array<infer Item>
  ? Item
  : never;
// 联合转每项函数的返回值，也就是功能节点的类型
type FuncNode = Exclude<
  NodeTypeUnion extends (line: string) => infer R ? R : never,
  null
>;
export type NodeType = TextNode | FuncNode;

// 构造type键到NodeType的字典
type ActionSelector<
  T extends NodeType['type'],
  U extends { type: NodeType['type'] },
> = U extends { type: T } ? U : never;
export type NodeTypeMap = {
  [T in NodeType['type']]: ActionSelector<T, NodeType>;
};

// 解析文本为节点列表
export const parseText = (text: string, mergeNearTextNode = false) => {
  const textList = text.split('\n');
  const nodeList: NodeType[] = [];
  const textStack: string[] = [];
  const makeTextNodeFromTextStack = () => {
    if (textStack.length) {
      nodeList.push({
        type: 'text',
        text: textStack.join('\n') + '\n',
      });
      textStack.splice(0, textStack.length);
    }
  };
  textList.forEach((rowLine) => {
    const line = rowLine.trim();
    // 是否是节点
    if (line.startsWith('【')) {
      for (let parser of nodeParserList) {
        const node = parser(line);
        // 确定是node
        if (node) {
          // 之前积攒的文本要形成一个文本节点
          makeTextNodeFromTextStack();
          nodeList.push(node);
          return;
        }
      }
    }
    // 是普通文本
    textStack.push(rowLine);
    // 如果不用合并每一段文本，那每次添加后立刻生成一个文本节点
    if (!mergeNearTextNode) {
      makeTextNodeFromTextStack();
    }
  });
  // 最后的文本
  makeTextNodeFromTextStack();
  return nodeList;
};
