import { SyncOutlined } from '@ant-design/icons';
import { ContentTitle } from './ContentLayout';

const HavingSomething = () => {
  return (
    <>
      <ContentTitle
        left={
          <div>
            来点
            <span>色色</span>
          </div>
        }
        right={
          <SyncOutlined
            className="text-xl relative -top-1"
            onClick={() => {
              console.log('刷新');
            }}
          />
        }
      />
    </>
  );
};

export default HavingSomething;
