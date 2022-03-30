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
      <div className="text-black whitespace-nowrap" style={{ width: '72px' }}>
        {stringHash(ip)}
      </div>
      <div className="flex-grow">
        {new Date(_time).toLocaleString().slice(2, -3)}
      </div>
      <div className="text-right mr-0.5">{rightEle}</div>
    </div>
  );
};

export default NameTime;
