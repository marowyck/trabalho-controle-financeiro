import { PencilSimple, Trash, CheckCircle, Clock } from '@phosphor-icons/react';
import { CategoryIcon } from '../utils/categoryIcons';

const PAYMENT_LABELS = {
  dinheiro: 'Dinheiro',
  cartao_credito: 'Cartão de Crédito',
  cartao_debito: 'Cartão de Débito',
  pix: 'PIX',
  transferencia: 'Transferência',
  boleto: 'Boleto',
};

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

function formatDate(date) {
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
}

export default function TransactionCards({ transactions, onEdit, onDelete }) {
  if (!transactions.length) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {transactions.map((t) => (
        <div
          key={t.id}
          className="surface group flex flex-col rounded-xl p-5 transition-all hover:shadow-lg"
        >
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-neutral-800 dark:text-neutral-200">
                {t.description}
              </p>
              <p className="mt-0.5 text-xs text-neutral-400">{formatDate(t.date)}</p>
            </div>
            <p
              className={`shrink-0 text-lg font-bold ${
                t.type === 'receita'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-expense'
              }`}
            >
              {t.type === 'despesa' ? '−' : '+'}
              {formatCurrency(t.amount)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${t.category_color}18`,
                borderColor: `${t.category_color}50`,
                color: t.category_color,
              }}
            >
              <CategoryIcon name={t.category_icon || 'Tag'} size={12} weight="bold" />
              {t.category_name}
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${
                t.status === 'pago'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400'
                  : 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400'
              }`}
            >
              {t.status === 'pago' ? (
                <CheckCircle size={12} weight="fill" />
              ) : (
                <Clock size={12} weight="fill" />
              )}
              {t.status === 'pago' ? 'Pago' : 'Pendente'}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
            <p className="text-xs text-neutral-400">{PAYMENT_LABELS[t.payment_method]}</p>
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onEdit(t)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                title="Editar"
              >
                <PencilSimple size={15} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(t)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-expense/10 hover:text-expense"
                title="Excluir"
              >
                <Trash size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
