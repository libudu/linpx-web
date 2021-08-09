import { useState, FC, ReactNode } from 'react';

let _setVisible: (visible: boolean) => any;
let _children: ReactNode;

interface IOpenModal {
  children: ReactNode;
}

export const openModal = ({ children }: IOpenModal) => {
  _children = children;
  _setVisible(true);
};

export const closeModal = () => {
  _children = null;
  _setVisible(false);
};

export const MountModal: FC = () => {
  const [visible, setVisible] = useState(false);
  _setVisible = setVisible;
  if (!visible || !_children) return <></>;
  return (
    <div className="w-full h-full absolute top-0 z-30">
      <div
        className="bg-black bg-opacity-40 absolute w-full h-full top-0"
        onClick={closeModal}
      />
      {_children}
    </div>
  );
};
