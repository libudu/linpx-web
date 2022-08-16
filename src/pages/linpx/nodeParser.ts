/** todo:
 * 开启、关闭节点。
 * 开启/关闭文本显示过渡（默认开启）
 * 开启/关闭结束的分割线和重新开始按钮（默认开启）
 *
 * 在线编辑和预览
 * 编辑时预检查：总共有哪些标签、跳转的标签是否都存在且合法
 * 分享功能：生成可以分享给朋友的链接
 *
 * linpx首页引导，用户可以点入linpx-word所有可玩文本的页面，并且提供样例和模板可以自己创作
 *
 * 优先级低：普通文本中的【加粗】、【斜体】、【发光】、【抖动】标签
 **/

// 文本节点
export type TextNode = {
  type: 'text';
  text: string;
};

// 快速构造无参节点的解析器
const makeNoArgNodeParser = <T extends string>(
  keyWord: string,
  typeName: T,
): ((line: string) => { type: T } | null) => {
  return (line: string) => {
    if (line.startsWith(`【${keyWord}】`)) {
      return { type: typeName };
    }
    return null;
  };
};

// 清空节点
export type ClearNode = { type: 'clear' };
const parseClearNode = makeNoArgNodeParser('清空', 'clear');

// 开始结束节点
export type StartNode = { type: 'start' };
const parseStartNode = makeNoArgNodeParser('开始', 'start');

export type EndNode = { type: 'end' };
const parseEndNode = makeNoArgNodeParser('结束', 'end');

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
  | EndNode
  | ClearNode;
export type NodeType = TextNode | FuncNode;

const nodeParserList = [
  parseStartNode,
  parseEndNode,
  parseLabelNode,
  parseJumpLabelNode,
  parseChoiceNode,
  parseClearNode,
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
