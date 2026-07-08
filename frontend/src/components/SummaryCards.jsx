import { TrendUp, TrendDown, Wallet, CalendarBlank } from '@phosphor-icons/react';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

const cards = [
  {
    key: 'saldo',
    label: 'Saldo Total',
    icon: Wallet,
    iconClass: 'text-neutral-700 dark:text-neutral-300',
    getValue: (d) => d.saldo,
  },
  {
    key: 'receitas_mes',
    label: 'Receitas do Mês',
    icon: TrendUp,
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    getValue: (d) => d.receitas_mes,
  },
  {
    key: 'despesas_mes',
    label: 'Despesas do Mês',
    icon: TrendDown,
    iconClass: 'text-brand',
    getValue: (d) => d.despesas_mes,
  },
  {
    key: 'saldo_mes',
    label: 'Saldo do Mês',
    icon: CalendarBlank,
    iconClass: 'text-neutral-700 dark:text-neutral-300',
    getValue: (d) => d.saldo_mes,
  },
];

export default function SummaryCards({ data }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, iconClass, getValue }) => {
        const value = getValue(data);
        return (
          <div key={key} className="surface rounded-md p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {label}
              </p>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800">
                <Icon size={16} className={iconClass} weight="bold" />
              </div>
            </div>
            <p
              className={`mt-3 text-2xl font-semibold tracking-tight ${
                value < 0 ? 'text-brand' : 'text-neutral-900 dark:text-white'
              }`}
            >
              {formatCurrency(value)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
