import classNames from 'classnames';
import Tag from '@/components/Tag';
import { copyTextAndToast } from '@/utils/clipboard';
import { updateNovelStyle, novelStyle } from '..';

function Item({ children }: { children: any }) {
  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
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
      className="rounded-full border-black border-solid border mx-1 mt-0.5 w-5 h-5 bg-gray-500"
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

interface INovelMenu {
  id: string;
  userName: string;
  title: string;
}

export default function NovelMenu({ id, userName, title }: INovelMenu) {
  const shareText =
    `【我正在用LINPX看 ${userName} 写的《${title}》，快来一起看吧】\n` +
    `链接1：http://furrynovel.xyz/pixiv/novel/${id}\n` +
    `链接2：https://linpx.linpicio.com/pixiv/novel/${id}`;
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
          <FontSizePicker sizeClass="text-lg" name="小" />
          <FontSizePicker sizeClass="text-xl" name="中" />
          <FontSizePicker sizeClass="text-2xl" name="大" />
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
          onClick={() =>
            copyTextAndToast(`https://www.pixiv.net/novel/show.php?id=${id}`)
          }
        >
          分享pixiv链接
        </div>
      </Item>
      <Line />
      <Item>
        <div onClick={() => copyTextAndToast(shareText)}>分享LINPX链接</div>
      </Item>
    </div>
  );
}
