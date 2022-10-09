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

export default function ({ history }: React.PropsWithChildren<any>) {
  return (
    <PageLayout title="交互小说" rightEle={<div />}>
      <div className="px-4">
        {/* <div className="font-bold text-2xl">最近作品</div>
        {[
          '测试1',
          '测试2（内容一样，凑数的）',
          '测试3（内容一样，凑数的）',
        ].map((title, index) => (
          <div
            key={index}
            className="u-line-1 bg-gray-200 my-2 rounded-lg px-2 py-1"
            onClick={() => history.push(`/linpx/run/example`)}
          >
            {title}
          </div>
        ))} */}

        <div className="font-bold text-2xl my-1">Linpx-Novel简介</div>
        <HomeIntro />

        <div className="font-bold text-2xl mt-4">我也试试</div>
        <HomeManager />

        <div className="font-bold text-2xl mt-4">Linpx-Novel教程（待完善）</div>
        <div>
          <div className="text-xl mt-2">分支跳转</div>
          <div className="text-lg">
            <div>·声明标签：【标签 标签名】</div>
            <div className="pl-4">
              声明一个标签，可以通过跳转标签跳转到该位置
            </div>
            <div>·跳转标签：【跳转标签 标签名】</div>
            <div className="pl-4">跳转到一个声明了的标签</div>
          </div>

          <div className="text-xl mt-2">声明选项</div>
          <div>【选项】选项文本</div>

          <div>功能设置</div>
          <div>【开始 设置名】、【关闭 设置名】</div>
          <div>【关闭 结尾按钮】</div>
          <div>【开启 合并相邻文本】</div>
          <div>【关闭 等待滚动】</div>

          <div>其他项</div>
          <div>【开始】、【结束】</div>
          <div>【清空】</div>
        </div>
      </div>
    </PageLayout>
  );
}
