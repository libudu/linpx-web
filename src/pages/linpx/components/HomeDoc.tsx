const HomeDoc: React.FC = () => {
  return (
    <div>
      <div className="font-bold text-2xl mt-4">Linpx-Novel教程（待完善）</div>
      <div className="text-xl mt-2">分支跳转</div>
      <div className="text-lg">
        <div>·声明标签：【标签 标签名】</div>
        <div className="pl-4">声明一个标签，可以通过跳转标签跳转到该位置</div>
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
  );
};

export default HomeDoc;
