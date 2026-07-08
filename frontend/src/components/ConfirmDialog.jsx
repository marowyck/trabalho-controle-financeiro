import { Warning } from '@phosphor-icons/react';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
          <Warning size={20} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-neutral-700 dark:text-neutral-300">{message}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} disabled={loading} className="btn-danger">
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
