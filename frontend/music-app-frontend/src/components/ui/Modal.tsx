import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, icon }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-neutral-900 rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          {icon && <div className="mb-4">{icon}</div>}
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;