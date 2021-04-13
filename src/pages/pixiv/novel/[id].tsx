import { useState, useEffect } from 'react';
import { IRouteProps, history } from 'umi';
import { getPixivNovel, INovelInfo } from '@/utils/api';
import { ArrowLeftOutlined, MenuOutlined } from '@ant-design/icons';
import { Popover } from 'antd-mobile';

import Navbar, { ContentNavbar } from '@/components/Navbar';
import Tag from '@/components/Tag';
import classNames from 'classnames';

import { copyTextAndToast } from '../../../utils/clipboard';

let updateNovelStyle: any;
let novelStyle = {
  fontFamily: '',
  fontSizeClass: '',
  bgColor: '',
  color: '#000',
};

function NovelMenu({ id }: { id: string }) {
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
        <div className="flex flex-col mr-6 text-base">
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
          onClick={() => copyTextAndToast(`https://www.pixiv.net/users/${id}`)}
        >
          复制LINPX链接
        </div>
      </Item>
    </div>
  );
}

export default function PixivNovel({ match }: IRouteProps) {
  document.title = 'Linpx - 小说详情';
  const id = match.params.id;

  const [novelInfo, setNovelInfo] = useState<INovelInfo>();

  updateNovelStyle = () => {
    setNovelInfo(Object.assign({}, novelInfo));
  };

  useEffect(() => {
    getPixivNovel(id).then((res: any) => {
      if (res?.error) return;
      setNovelInfo(res);
    });
  }, []);

  if (!novelInfo) {
    return <ContentNavbar>小说详情</ContentNavbar>;
  }

  const { title, content, userName, userId, coverUrl, tags, desc } = novelInfo;

  return (
    <>
      <Navbar
        leftEle={
          <ArrowLeftOutlined
            onClick={() => history.push(`/pixiv/user/${userId}`)}
          />
        }
        rightEle={
          // @ts-ignore
          <Popover
            overlay={<NovelMenu id={id} />}
            overlayStyle={{ width: 'max-content' }}
          >
            <MenuOutlined />
          </Popover>
        }
        children="小说详情"
        fixed
      />
      {novelInfo && (
        <>
          <div className="py-4 pt-20 text-center bg-yellow-100 bg-opacity-25 shadow-lg relative z-10">
            <div className="flex justify-center">
              <img src={coverUrl} className="h-64 rounded-lg" />
            </div>
            <div className="mt-2 mx-8 font-bold text-3xl">{title}</div>
            <div className="mb-1 px-16 text-2xl text-gray-500">{userName}</div>
            <div className="text-gray-500 text-base px-8">
              {tags.map((ele) => (
                <Tag key={ele} children={ele} />
              ))}
            </div>
            <div
              className="px-8 mt-1 text-base"
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          </div>
          <div
            className={classNames(
              'whitespace-pre-line p-4',
              novelStyle.fontSizeClass,
            )}
            style={{
              pointerEvents: 'none',
              background: novelStyle.bgColor,
              color: novelStyle.color,
              fontFamily: novelStyle.fontFamily,
            }}
          >
            {content}
          </div>
          <div className="absolute bottom-0 w-full bg-white">
            <div>{}</div>
            <div></div>
          </div>
        </>
      )}
    </>
  );
}
