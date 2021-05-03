import { history } from 'umi';
import classnames from 'classnames';
import { InfoCircleOutlined } from '@ant-design/icons';
import { showInfoModal } from './Modal';

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
      <div
        className="inline-block font-bold text-3xl pl-2"
        style={{ width: 'max-content' }}
      >
        {left}
        {clickInfo && (
          <InfoCircleOutlined
            onClick={() =>
              showInfoModal({
                title: left,
                children: clickInfo,
              })
            }
            className="text-xl inline-block  ml-2"
          />
        )}
      </div>
      <div
        className="inline-block text-base text-right pr-2 flex-grow"
        children={
          <span
            style={{ borderBottom: '1px solid black' }}
            children={right}
            onClick={() => {
              history.push(clickRightPath);
            }}
          />
        }
      />
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
