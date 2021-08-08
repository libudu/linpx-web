import { history } from 'umi';
import classnames from 'classnames';
import { InfoCircleOutlined } from '@ant-design/icons';
import { openInfoModal } from './Modal';

// 内容标题
export function ContentTitle({
  left,
  right = '查看全部',
  clickInfo,
  clickRightPath,
}: {
  left: any;
  right?: any;
  clickInfo?: any;
  clickRightPath?: any;
}) {
  return (
    <div className="mb-3 mt-6 flex items-end">
      <div className="font-black text-3xl pl-2">
        {left}
        {clickInfo && (
          <InfoCircleOutlined
            className="text-xl inline-block ml-2"
            onClick={() =>
              openInfoModal({
                title: left,
                children: clickInfo,
              })
            }
          />
        )}
      </div>
      <div className="text-base text-right pr-2 flex-grow">
        <span
          style={{ borderBottom: '1px solid black' }}
          onClick={() => history.push(clickRightPath)}
        >
          {right}
        </span>
      </div>
    </div>
  );
}

export function ContentBox({
  children,
  className,
}: {
  children: any;
  className?: any;
}) {
  return (
    <div
      className={classnames(
        'lp-shadow lp-bgcolor flex overflow-x-scroll show-scrollbar',
        className,
      )}
      style={{ minHeight: '6rem' }}
    >
      {children}
    </div>
  );
}
