/** todo:
 *
 * 【节点功能相关】
 * 开启、关闭节点。
 * 开启/关闭 逐段点击（默认关闭）
 * 即将滚动到底部后才开始过渡显示后续文本内容，避免玩家看着上面，底下自动全显示了（默认开启）
 *
 * 【开放性与运营】
 * 首页功能引导
 * 作者名称字段
 *
 * 【编辑器】
 * 编辑时着色：对功能标签采用视觉和普通文本不一样的表现
 *
 * 【特殊效果（优先级低）】
 * 【开启 文字特效】普通文本中的【加粗】、【斜体】、【发光】、【抖动】标签
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
    <PageLayout title="交互小说">
      <div className="px-4 py-2">
        <div className="font-bold text-2xl">最近作品</div>
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
        ))}

        <div className="font-bold text-2xl mt-4">我也试试</div>
        <HomeManager />

        <div className="font-bold text-2xl mt-4">Linpx-Novel简介</div>
        <HomeIntro />

        <div className="font-bold text-2xl mt-4">Linpx-Novel教程（待完善）</div>
        <div>
          <div>【标签】、【跳转标签 标签名】</div>
          <div>【选项】</div>
          <div>【开始】、【结束】</div>
          <div>【清空】</div>
          <div>【开始 设置名】、【关闭 设置名】</div>
          <div>【关闭 结尾按钮】</div>
          <div>【开启 合并相邻文本】</div>
          <div>死循环检测</div>
        </div>
      </div>
    </PageLayout>
  );
}
