import { Modal } from 'antd-mobile';
import { useState } from 'react';

let infoModalChildren: any = null;
let _showInfoModal: any = null;
let _showInfoTitle: string;
export let showInfoModal = ({
  children,
  title,
}: {
  children: any;
  title: string;
}) => {
  infoModalChildren = children;
  _showInfoTitle = title;
  _showInfoModal(true);
};

export function InfoModal() {
  const [show, setShow] = useState(false);
  _showInfoModal = setShow;
  return (
    <Modal
      visible={show}
      transparent
      maskClosable={false}
      title={_showInfoTitle}
      footer={[{ text: '确认', onPress: () => setShow(false) }]}
    >
      {infoModalChildren}
    </Modal>
  );
}
