import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

function formatMonth(mes) {
  const [year, month] = mes.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const saldo = payload[0]?.value ?? 0;
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-md dark:border-neutral-700 dark:bg-neutral-900">
      <p className="mb-1 text-xs font-medium text-neutral-500">{label}</p>
      <p
        className={`text-sm font-bold ${
          saldo >= 0 ? 'text-brand' : 'text-expense'
        }`}
      >
        {formatCurrency(saldo)}
      </p>
    </div>
  );
}

export default function SaldoEvolutionChart({ data }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const tickColor = isDark ? '#a3a3a3' : '#737373';

  const chartData = data?.map((item) => ({
    mes: formatMonth(item.mes),
    saldo: item.receitas - item.despesas,
  }));

  if (!chartData?.length) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-neutral-500">
        Nenhum dado disponível
      </div>
    );
  }

  const hasNegative = chartData.some((d) => d.saldo < 0);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="saldoGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0D9488" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="mes"
          stroke={tickColor}
          tick={{ fill: tickColor, fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={tickColor}
          tick={{ fill: tickColor, fontSize: 12 }}
          tickFormatter={(v) => `R$${v}`}
          tickLine={false}
          axisLine={false}
          width={70}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0D9488', strokeWidth: 1.5, strokeDasharray: '4 2' }} />
        {hasNegative && <ReferenceLine y={0} stroke={isDark ? '#525252' : '#d4d4d4'} />}
        <Area
          type="monotone"
          dataKey="saldo"
          stroke="#0D9488"
          strokeWidth={2.5}
          fill="url(#saldoGradient)"
          dot={{ r: 4, fill: '#0D9488', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#0D9488', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
