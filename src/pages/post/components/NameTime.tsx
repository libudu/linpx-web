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
        'flex justify-between text-sm text-gray-500 mb-1',
        className,
      )}
    >
      <div style={{ width: '20%' }}>{stringHash(ip)}</div>
      <div className="text-center" style={{ width: '60%' }}>
        {new Date(_time * 1000).toLocaleString()}
      </div>
      <div className="text-right" style={{ width: '20%' }}>
        {rightEle}
      </div>
    </div>
  );
};

export default NameTime;
