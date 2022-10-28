/** todo:
 * 读者：可游玩的作品、小说列表中交互小说的视觉提示、交互小说的单独展示
 * 作者：介绍教程、编辑器功能
 *
 * 【节点功能相关】
 * 文字特效：普通文本中的【加粗】、【斜体】、【发光】、【抖动】标签
 *
 * 【开放性与运营】
 * 首页功能引导
 *
 * 【编辑器功能】
 * 编辑时着色：对功能标签采用视觉和普通文本不一样的表现
 *
 * 【后台】
 * 查看所有已发布作品的页面，方便管理
 **/

import PageLayout from '@/components/PageLayout';
import React from 'react';
import HomeIntro from './components/HomeIntro';
import HomeManager from './components/HomeManager';

import BlackLogoPng from '@/assets/logo/black_logo.png';
import WordLogoPng from '@/assets/logo/word_logo.png';
import HomeDoc from './components/HomeDoc';

export type IFileInfo = {
  id: string;
  title: string;
  time: string;
  text: string;
  release?: boolean;
};

export interface IFileDetail extends IFileInfo {
  postTime: string;
  author: string;
  password: string;
}

const HomeBanner: React.FC = () => {
  return (
    <div className="text-center mt-12 mb-6">
      <div className="text-4xl font-black">欢迎使用</div>
      <div className="text-4xl font-black my-2">
        <img className="w-7 mb-2" src={BlackLogoPng} />
        <img className="w-24 mb-2 mx-2" src={WordLogoPng} />
        Novel
      </div>
      <div className="text-base">简单快捷的互动小说格式</div>
    </div>
  );
};

export default function ({ history }: React.PropsWithChildren<any>) {
  return (
    <PageLayout title="交互小说" rightEle={<div />}>
      <div className="px-5">
        <HomeBanner />
        <HomeManager />
        <HomeIntro />
        {/* <HomeDoc /> */}
      </div>
    </PageLayout>
  );
}
