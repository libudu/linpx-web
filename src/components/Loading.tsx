import { CloseOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const lpImg: any = {};
for (let i = 1; i < 9; i++) {
  lpImg[i] = require('../assets/linpicio/' + i + '.jpg');
}

const logo = require('../assets/logo/app_logo.png');

export default function Loading() {
  const imgIndex = Math.floor(1 + Math.random() * 8);

  const [ellCount, setEllCount] = useState(0);

  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShow(true), 500);
    return () => {
      clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ellCount < 6) setEllCount(ellCount + 1);
      else setEllCount(0);
    }, 500);
    return () => {
      clearInterval(interval);
    };
  });

  const ellStr = '.'.repeat(ellCount);

  if (!show) return <div></div>;

  return (
    <div
      className="flex flex-col justify-center items-center bg-yellow-500 bg-opacity-10"
      style={{ height: 'calc(100vh - 3.5rem)' }}
    >
      <div className="flex justify-center items-center">
        <img className="rounded-2xl w-20 h-20" src={lpImg[imgIndex]}></img>
        <CloseOutlined
          className="text-4xl mx-4"
          style={{ color: 'rgba(75, 85, 99, 0.8)' }}
        />
        <img className="rounded-2xl w-20 h-20" src={logo}></img>
      </div>
      <div className="my-4 text-gray-600 text-3xl">加载中{ellStr}</div>
    </div>
  );
}
