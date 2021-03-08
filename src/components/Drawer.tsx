import { Drawer } from 'antd-mobile';

export default function () {
  return (
    <Drawer
      style={{ minHeight: document.documentElement.clientHeight }}
      enableDragHandle
      contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
      sidebar={<div>drawer</div>}
      open={true}
    />
  );
}
