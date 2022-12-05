import { Modal } from 'antd-mobile';
import { useState } from 'react';

interface InfoModalProps {
  children: any;
  title: React.ReactNode;
  footer?: { text: string; onPress: () => any }[];
}

let infoModalProps: InfoModalProps | undefined;
let _showInfoModal: (state: boolean) => void;
export let closeInfoModal = () => _showInfoModal(false);
export let openInfoModal = ({ children, title, footer }: InfoModalProps) => {
  infoModalProps = {
    children,
    title,
    footer,
  };
  _showInfoModal(true);
};

export function InfoModal() {
  const [show, setShow] = useState(false);
  _showInfoModal = setShow;

  if (!infoModalProps) return <></>;

  const { title, footer, children } = infoModalProps;
  return (
    <Modal
      visible={show}
      transparent
      maskClosable={false}
      title={title}
      footer={footer || [{ text: '确认', onPress: () => setShow(false) }]}
    >
      {children}
    </Modal>
  );
}
