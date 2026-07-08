import { X } from '@phosphor-icons/react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="surface relative z-10 w-full max-w-lg rounded-md p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
