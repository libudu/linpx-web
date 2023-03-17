import { history } from 'umi';
import classnames from 'classnames';
import { InfoCircleOutlined } from '@ant-design/icons';
import { openInfoModal } from './Modal';

// 内容标题
export const ContentTitle = ({
  left,
  clickInfo,
  clickInfoTitle,
  right,
  rightText = '查看全部',
  clickRightPath,
}: {
  left: React.ReactChild;
  clickInfo?: any;
  clickInfoTitle?: React.ReactChild;
  right?: React.ReactChild;
  rightText?: string;
  clickRightPath?: string;
}) => {
  return (
    <div className="mb-3 mt-6 flex items-end">
      <div className="font-black text-3xl pl-2 u-line-1">{left}</div>
      <div className="flex-grow mr-8">
        {clickInfo && (
          <InfoCircleOutlined
            className="text-xl inline-block ml-2"
            onClick={() =>
              openInfoModal({
                title: clickInfoTitle || left,
                children: clickInfo,
              })
            }
          />
        )}
      </div>
      <div className="text-base text-right pr-2">
        {right}
        {!right && (
          <span
            style={{ borderBottom: '1px solid black' }}
            onClick={() => clickRightPath && history.push(clickRightPath)}
          >
            {rightText}
          </span>
        )}
      </div>
    </div>
  );
};

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
        'lp-shadow lp-bgcolor flex overflow-x-scroll',
        className,
      )}
      style={{ minHeight: '6rem' }}
    >
      {children}
    </div>
  );
}
