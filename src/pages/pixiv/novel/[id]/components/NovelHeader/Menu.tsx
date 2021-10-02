import { FC } from 'react';
import classNames from 'classnames';
import Tag from '@/components/Tag';
import { setNovelStyles } from '@/models/styles';
import { shareNovel } from '@/utils/share';

const Item: FC = ({ children }) => {
  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      {children}
    </div>
  );
};

const Line: FC = () => {
  return <div className="w-full bg-gray-200 h-0.5" />;
};

const ColorPicker: FC<{
  bgColor: string;
  color?: string;
}> = ({ bgColor, color = '#000' }) => {
  return (
    <div
      className="rounded-full border-black border-solid border mx-1 mt-0.5 w-5 h-5 bg-gray-500"
      style={{ background: bgColor }}
      onClick={() => {
        setNovelStyles({
          bgColor,
          color,
        });
      }}
    />
  );
};

const FontSizePicker: FC<{
  fontSizeClass: string;
  name: string;
}> = ({ fontSizeClass, name }) => {
  return (
    <div
      className={classNames('text-lg px-2', fontSizeClass)}
      onClick={() => setNovelStyles({ fontSizeClass })}
      children={name}
    />
  );
};

const FontFamilyPicker: FC<{
  fontFamily: string;
  name: string;
}> = ({ fontFamily, name }) => {
  return (
    <Tag>
      <div
        className="mx-3"
        style={{ fontFamily }}
        onClick={() => setNovelStyles({ fontFamily })}
      >
        {name}
      </div>
    </Tag>
  );
};

interface INovelMenu {
  id: string;
  hideMenu: () => void;
}

export default ({ id, hideMenu }: INovelMenu) => {
  return (
    <div className="text-base lp-bgcolor">
      <Item>
        <div className="mr-2">背景色</div>
        <div className="flex">
          <ColorPicker bgColor="#fff" />
          <ColorPicker bgColor="#343434" color="#fff" />
          <ColorPicker bgColor="#F2EAE1" />
          <ColorPicker bgColor="#B8BEB8" />
        </div>
      </Item>
      <Line />
      <Item>
        <div>字号</div>
        <div className="flex items-center mr-1">
          <FontSizePicker fontSizeClass="text-base" name="小" />
          <FontSizePicker fontSizeClass="text-lg" name="中" />
          <FontSizePicker fontSizeClass="text-xl" name="大" />
        </div>
      </Item>
      <Line />
      <Item>
        <div>字体</div>
        <div className="flex flex-col mr-2 text-base">
          <FontFamilyPicker fontFamily="auto" name="系统默认" />
          <FontFamilyPicker fontFamily="Noto Sans SC" name="思源黑体" />
          <FontFamilyPicker fontFamily="Noto Serif SC" name="思源宋体" />
        </div>
      </Item>
      <Line />
      <Item>
        <div
          onClick={() => {
            shareNovel(id);
            hideMenu();
          }}
        >
          分享小说
        </div>
      </Item>
    </div>
  );
};
