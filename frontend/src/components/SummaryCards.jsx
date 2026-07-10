import { TrendUp, TrendDown, Wallet, CalendarBlank, ArrowUp, ArrowDown } from '@phosphor-icons/react';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

function calcVariation(current, previous) {
  if (!previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

function VariationBadge({ variation }) {
  if (variation === null) return null;
  const isPositive = variation >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
        isPositive
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
          : 'bg-expense/10 text-expense'
      }`}
    >
      {isPositive ? <ArrowUp size={11} weight="bold" /> : <ArrowDown size={11} weight="bold" />}
      {Math.abs(variation).toFixed(1)}%
    </span>
  );
}

export default function SummaryCards({ data }) {
  const cards = [
    {
      key: 'saldo',
      label: 'Saldo Total',
      icon: Wallet,
      iconClass: 'text-neutral-700 dark:text-neutral-300',
      getValue: (d) => d.saldo,
      getPrev: null,
    },
    {
      key: 'receitas_mes',
      label: 'Receitas do Mês',
      icon: TrendUp,
      iconClass: 'text-emerald-600 dark:text-emerald-400',
      getValue: (d) => d.receitas_mes,
      getPrev: (d) => d.receitas_mes_anterior,
    },
    {
      key: 'despesas_mes',
      label: 'Despesas do Mês',
      icon: TrendDown,
      iconClass: 'text-expense',
      getValue: (d) => d.despesas_mes,
      getPrev: (d) => d.despesas_mes_anterior,
    },
    {
      key: 'saldo_mes',
      label: 'Saldo do Mês',
      icon: CalendarBlank,
      iconClass: 'text-neutral-700 dark:text-neutral-300',
      getValue: (d) => d.saldo_mes,
      getPrev: (d) => d.saldo_mes_anterior,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, iconClass, getValue, getPrev }) => {
        const value = getValue(data);
        const prev = getPrev ? getPrev(data) : null;
        const variation = prev !== null ? calcVariation(value, prev) : null;

        return (
          <div key={key} className="surface rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {label}
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Icon size={17} className={iconClass} weight="bold" />
              </div>
            </div>
            <p
              className={`mt-3 text-2xl font-bold tracking-tight ${
                value < 0 ? 'text-expense' : 'text-neutral-900 dark:text-white'
              }`}
            >
              {formatCurrency(value)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <VariationBadge variation={variation} />
              {variation !== null && (
                <span className="text-xs text-neutral-400">vs mês anterior</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
