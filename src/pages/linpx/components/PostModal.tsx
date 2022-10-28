import { Input } from 'antd';
import { useState } from 'react';
import { history } from 'umi';
import { IFileDetail, IFileInfo } from '..';
import { fileApi } from '../utils/fileSystem';
import { closeModal, openModal } from '@/components/LinpxModal';
import { Toast } from 'antd-mobile';
import CopySpan from '@/pages/components/CopySpan';
import { useFileInfo } from '../edit';
import { linpxNovelApi } from '@/api/linpx';
import { getLinpxNovelShareInfo } from '../utils';

const ModalWrapper: React.FC = ({ children }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-white rounded-xl w-full z-20 p-5 pt-3 mx-5">
        {children}
      </div>
    </div>
  );
};

const LinpxButton: React.FC<{ onClick: () => void }> = ({
  children,
  onClick,
}) => {
  return (
    <div
      className="text-xl font-bold text-center bg-linpx-orange text-white rounded-full mt-4 px-12 py-1"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const PostModal = ({
  fileInfo,
  onClose,
  actionType,
}: {
  fileInfo: IFileInfo;
  onClose?: () => void;
  actionType: '发布' | '更新';
}) => {
  const { title } = fileInfo;
  const [fileDetail, setFileDetail] = useState<Omit<IFileDetail, 'postTime'>>({
    author: '',
    password: '',
    ...fileInfo,
  });
  return (
    <ModalWrapper>
      <div className="text-2xl font-black text-center">
        {actionType}互动小说
      </div>
      <div className="text-sm text-center py-1 mb-1">
        发布后将生成分享链接，你可以将链接分享给朋友游玩
      </div>
      <Input
        className="cover-antd-input rounded-t-xl"
        style={{ borderRadius: '16px 16px 0 0' }}
        prefix={<div className="mr-10">标题</div>}
        value={title}
        readOnly
      />
      <Input
        className="cover-antd-input"
        placeholder="请输入作者"
        defaultValue={fileDetail.author}
        prefix={<div className="mr-10">作者</div>}
        maxLength={100}
        onChange={(e) => (fileDetail.author = e.target.value)}
      />
      <Input
        className="cover-antd-input"
        style={{ borderRadius: '0 0 16px 16px' }}
        placeholder="请输入编辑密码"
        defaultValue={fileDetail.password}
        prefix="编辑密码"
        maxLength={12}
        onChange={(e) => (fileDetail.password = e.target.value)}
      />
      <div className="text-sm mt-2 mb-3 px-2.5">
        由于linpx不设置账号系统，编辑密码可以防止他人篡改你的作品，并可以在遗失后找回作品
      </div>
      <div className="flex justify-center">
        <LinpxButton
          onClick={async () => {
            // 检验
            if (!fileDetail.author) return Toast.fail('请输入作者', 1);
            if (!fileDetail.password) return Toast.fail('请输入编辑密码', 1);
            // 新数据写入并刷新
            fileDetail.release = true;
            fileApi.writeFile(fileDetail.id, JSON.stringify(fileDetail));
            setFileDetail({ ...fileDetail });
            // 发送请求
            const result = await linpxNovelApi.postOne({ ...fileDetail });
            if (result.success) {
              Toast.success(result.msg, 1);
              closeModal();
              onClose && onClose();
              setTimeout(
                () =>
                  openModal({
                    children: (
                      <PostSuccessModal
                        fileId={fileInfo.id}
                        actionType={actionType}
                      />
                    ),
                  }),
                1,
              );
            } else {
              Toast.fail('发布失败：' + result.msg, 1);
            }
          }}
        >
          {actionType}
        </LinpxButton>
      </div>
    </ModalWrapper>
  );
};

export default PostModal;

const PostSuccessModal = ({
  fileId,
  actionType,
}: {
  fileId: string;
  actionType: '发布' | '更新';
}) => {
  const { fileInfo: fileDetail } = useFileInfo(fileId) as any;
  if (!fileDetail) return <div />;
  const { id, title, author, password, release } = fileDetail;
  const { url, path } = getLinpxNovelShareInfo(id);
  return (
    <ModalWrapper>
      <div className="text-2xl font-black text-center mb-2">
        {actionType}成功！
      </div>
      <Input
        className="cover-antd-input"
        style={{ borderRadius: '16px 16px 0 0' }}
        prefix={<div className="mr-14 pr-1">ID</div>}
        value={id}
        readOnly
      />
      <Input
        className="cover-antd-input"
        prefix={<div className="mr-10">标题</div>}
        value={title}
        readOnly
      />
      <Input
        className="cover-antd-input"
        prefix={<div className="mr-10">作者</div>}
        value={author}
        readOnly
      />
      <Input
        className="cover-antd-input"
        prefix="编辑密码"
        value={password}
        readOnly
      />
      <Input
        className="cover-antd-input"
        style={{ borderRadius: '0 0 16px 16px' }}
        prefix="分享网址"
        value={url}
        readOnly
      />
      <div className="flex justify-between mt-1 mb-3 text-base mx-2">
        <div className="text-gray-500">建议对当前页面截图以保存信息</div>
        <CopySpan text={url}>复制链接</CopySpan>
      </div>
      <div className="flex justify-around">
        <LinpxButton onClick={() => closeModal()}>返回</LinpxButton>
        <LinpxButton
          onClick={() => {
            closeModal();
            history.push(path);
          }}
        >
          游览
        </LinpxButton>
      </div>
    </ModalWrapper>
  );
};
