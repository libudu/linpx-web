import { useState } from 'react';
import classnames from 'classnames';
import { IUserInfo } from '@/utils/api';
import { getAppWidth } from '@/utils/util';
import { Modal } from 'antd-mobile';

interface ITagBox {
  tagName: string;
  time?: number;
  size: 'lg' | 'md' | 'sm';
  className?: any;
  onClickTag?: (tagName: string) => any;
}

// TagBox随机颜色
const tagColors = [
  'bg-red-400',
  'bg-red-500',
  'bg-yellow-400',
  'bg-green-400',
  'bg-green-500',
  'bg-blue-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-indigo-400',
];

function randomColor() {
  return tagColors[Math.floor(Math.random() * tagColors.length)];
}

const tagConfig = {
  lg: {
    width: '48%',
    tagFontSize: '20px',
  },
  md: {
    width: '32%',
    tagFontSize: '18px',
  },
  sm: {
    width: '19%',
    tagFontSize: '14px',
  },
};

export function TagBox({
  tagName,
  time,
  size,
  onClickTag,
  className,
}: ITagBox) {
  const { width, tagFontSize } = tagConfig[size];
  const [color] = useState(randomColor());

  return (
    <div
      className={classnames('px-2 py-1', className)}
      style={{ minWidth: width }}
      onClick={() => onClickTag && onClickTag(tagName)}
    >
      <div className={classnames('py-0.5 rounded-2xl text-white px-1', color)}>
        <div
          style={{ fontSize: tagFontSize, lineHeight: '24px', height: '24px' }}
        >
          {tagName}
        </div>
        <div style={{ fontSize: '14px', lineHeight: '16px', height: '16px' }}>
          {time}
        </div>
      </div>
    </div>
  );
}

interface ITagBoxListModal {
  tags: IUserInfo['tags'];
  show: boolean;
  onClose: any;
  onClickTag?: (tagName: string) => any;
}

export function TagBoxListModal({
  tags,
  show,
  onClose,
  onClickTag,
}: ITagBoxListModal) {
  const width = getAppWidth();
  return (
    <Modal
      maskClosable
      transparent
      visible={show}
      onClose={onClose}
      className="tagbox-modal overflow-y-scroll"
      style={{ width, maxHeight: '70vh' }}
    >
      <TagBoxList tags={tags} onClickTag={onClickTag} />
    </Modal>
  );
}

interface ITagBoxList {
  tags: IUserInfo['tags'];
  showTotalButton?: boolean;
  clickShowTotal?: any;
  showCount?: number;
  onClickTag?: (tagName: string) => any;
}

export function TagBoxList({
  tags,
  showTotalButton,
  clickShowTotal,
  showCount,
  onClickTag,
}: ITagBoxList) {
  return (
    <div className="flex flex-wrap">
      {Object.entries(tags).map(([tagName, time], index) => {
        if (showCount && index >= showCount) return null;
        let size: ITagBox['size'];
        if (index < 2) size = 'lg';
        else if (index < 8) size = 'md';
        else size = 'sm';
        return (
          <TagBox
            key={tagName}
            tagName={tagName}
            time={time}
            size={size}
            onClickTag={onClickTag}
          />
        );
      })}
      {showTotalButton && (
        <div
          className="px-2 py-1"
          style={{ minWidth: '32%' }}
          onClick={clickShowTotal}
        >
          <div
            className="py-0.5 rounded-2xl bg-gray-400 text-white flex justify-center items-center"
            style={{ height: '44px' }}
          >
            <div
              style={{
                fontSize: '18px',
                lineHeight: '24px',
                borderBottom: '1px solid white',
              }}
            >
              查看全部
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
