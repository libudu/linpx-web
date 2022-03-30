import { stringHash } from '@/utils/util';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

const NameTime: React.FC<{
  ip: string;
  _time: number;
  rightEle?: ReactNode;
  className?: string;
}> = ({ ip, _time, rightEle, className }) => {
  return (
    <div
      className={classNames(
        'flex justify-between text-base text-gray-400',
        className,
      )}
    >
      <div style={{ width: '17%' }}>{stringHash(ip)}</div>
      <div style={{ width: '63%' }}>
        {new Date(_time).toLocaleString().slice(2, -3)}
      </div>
      <div className="text-right mr-0.5" style={{ width: '20%' }}>
        {rightEle}
      </div>
    </div>
  );
};

export default NameTime;
