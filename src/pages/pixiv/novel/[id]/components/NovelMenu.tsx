import classNames from 'classnames';
import Tag from '@/components/Tag';
import { copyTextAndToast } from '@/utils/clipboard';
import { updateNovelStyle, novelStyle } from '..';
import { history } from 'umi';

interface INovelMenu {
  id: string;
}

function Item({ children }: { children: any }) {
  return (
    <div className="px-2 py-1 flex items-center justify-between">
      {children}
    </div>
  );
}

function Line() {
  return <div className="w-full bg-gray-200 h-0.5" />;
}

function ColorPicker({
  bgColor,
  color = '#000',
}: {
  bgColor: string;
  color?: string;
}) {
  return (
    <div
      className="rounded-full border-black border-solid border mx-1 mt-0.5 w-6 h-6 bg-gray-500"
      style={{ background: bgColor }}
      onClick={() => {
        novelStyle.bgColor = bgColor;
        novelStyle.color = color;
        updateNovelStyle();
      }}
    />
  );
}

function FontSizePicker({
  sizeClass,
  name,
}: {
  sizeClass: string;
  name: string;
}) {
  return (
    <div
      className={classNames('text-lg px-2', sizeClass)}
      onClick={() => {
        novelStyle.fontSizeClass = sizeClass;
        updateNovelStyle();
      }}
      children={name}
    />
  );
}

function FontFamilyPicker({
  fontFamily,
  name,
}: {
  fontFamily: string;
  name: string;
}) {
  return (
    <Tag>
      <div
        className="mx-3"
        style={{ fontFamily }}
        onClick={() => {
          novelStyle.fontFamily = fontFamily;
          updateNovelStyle();
        }}
      >
        {name}
      </div>
    </Tag>
  );
}

export default function NovelMenu({ id }: INovelMenu) {
  return (
    <div className="text-lg lp-bgcolor">
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
        <div className="flex items-center mr-3">
          <FontSizePicker sizeClass="text-lg" name="小" />
          <FontSizePicker sizeClass="text-xl" name="中" />
          <FontSizePicker sizeClass="text-2xl" name="大" />
        </div>
      </Item>
      <Line />
      <Item>
        <div>字体</div>
        <div className="flex flex-col mr-4 text-base">
          <FontFamilyPicker fontFamily="auto" name="系统默认" />
          <FontFamilyPicker fontFamily="Noto Sans SC" name="思源黑体" />
          <FontFamilyPicker fontFamily="Noto Serif SC" name="思源宋体" />
        </div>
      </Item>
      <Line />
      <Item>
        <div
          onClick={() =>
            copyTextAndToast(`https://www.pixiv.net/novel/show.php?id=${id}`)
          }
        >
          复制pixiv链接
        </div>
      </Item>
      <Line />
      <Item>
        <div
          onClick={() =>
            copyTextAndToast(`https://linpx.linpicio.com/pixiv/novel/${id}`)
          }
        >
          复制LINPX链接
        </div>
      </Item>
    </div>
  );
}
