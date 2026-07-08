import { PencilSimple, Trash } from '@phosphor-icons/react';

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

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  if (!transactions.length) {
    return (
      <div className="surface rounded-md p-12 text-center text-sm text-neutral-500">
        Nenhuma transação encontrada
      </div>
    );
  }

  return (
    <div className="surface overflow-hidden rounded-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500 dark:border-neutral-800">
            <tr>
              <th className="px-4 py-3 font-medium">Descrição</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Pagamento</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {transactions.map((t) => (
              <tr
                key={t.id}
                className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
              >
                <td className="px-4 py-3.5 font-medium text-neutral-800 dark:text-neutral-200">
                  {t.description}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className="inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: `${t.category_color}14`,
                      borderColor: `${t.category_color}4d`,
                      color: t.category_color,
                    }}
                  >
                    {t.category_name}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-neutral-500">{formatDate(t.date)}</td>
                <td
                  className={`px-4 py-3.5 font-semibold ${
                    t.type === 'receita'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-brand'
                  }`}
                >
                  {t.type === 'despesa' ? '- ' : '+ '}
                  {formatCurrency(t.amount)}
                </td>
                <td className="px-4 py-3.5 text-neutral-500">
                  {PAYMENT_LABELS[t.payment_method]}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                      t.status === 'pago'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400'
                        : 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400'
                    }`}
                  >
                    {t.status === 'pago' ? 'Pago' : 'Pendente'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(t)}
                      className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                      title="Editar"
                    >
                      <PencilSimple size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(t)}
                      className="rounded-md p-1.5 text-neutral-400 hover:bg-brand/10 hover:text-brand"
                      title="Excluir"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
