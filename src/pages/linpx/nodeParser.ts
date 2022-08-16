export type TextNode = {
  type: 'text';
  text: string;
};

// 开始结束节点
export type StartNode = { type: 'start' };
const parseStartNode = (line: string): StartNode | null => {
  if (line.startsWith('【开始】')) {
    return { type: 'start' };
  }
  return null;
};

export type EndNode = { type: 'end' };
const parseEndNode = (line: string): EndNode | null => {
  if (line.startsWith('【结束】')) {
    return { type: 'end' };
  }
  return null;
};

// 标签节点
export type LabelNode = {
  type: 'label';
  labelName: string;
};

const parseLabelNode = (line: string): LabelNode | null => {
  const result = line.match(/^【标签 (.*)】/);
  if (result) {
    return {
      type: 'label',
      labelName: result[1],
    };
  }
  return null;
};

// 跳转标签节点
export type JumpLabelNode = {
  type: 'jumpLabel';
  labelName: string;
};

const parseJumpLabelNode = (line: string): JumpLabelNode | null => {
  const result = line.match(/^【跳转标签 (.*)】/);
  if (result) {
    return {
      type: 'jumpLabel',
      labelName: result[1],
    };
  }
  return null;
};

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

export type FuncNode =
  | ChoiceNode
  | LabelNode
  | JumpLabelNode
  | StartNode
  | EndNode;
export type NodeType = TextNode | FuncNode;

const nodeParserList = [
  parseStartNode,
  parseEndNode,
  parseLabelNode,
  parseJumpLabelNode,
  parseChoiceNode,
];

export const parseText = (text: string) => {
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
  });
  // 最后的文本
  makeTextNodeFromTextStack();
  return nodeList;
};
