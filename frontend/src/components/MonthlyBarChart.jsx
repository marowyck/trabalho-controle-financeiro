import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

export default function MonthlyBarChart({ data }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const tickColor = isDark ? '#a3a3a3' : '#525252';

  const chartData = data?.map((item) => ({
    ...item,
    mesLabel: formatMonth(item.mes),
  }));

  if (!chartData?.length) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-neutral-500">
        Nenhum dado disponível
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="mesLabel" stroke={tickColor} tick={{ fill: tickColor, fontSize: 12 }} />
        <YAxis
          stroke={tickColor}
          tick={{ fill: tickColor, fontSize: 12 }}
          tickFormatter={(v) => `R$${v}`}
        />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{
            background: isDark ? '#171717' : '#ffffff',
            border: `1px solid ${isDark ? '#404040' : '#e5e5e5'}`,
            borderRadius: 6,
            color: isDark ? '#f5f5f5' : '#171717',
          }}
          cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
        />
        <Legend
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => <span style={{ color: tickColor }}>{value}</span>}
        />
        <Bar dataKey="receitas" name="Receitas" fill="#059669" radius={[3, 3, 0, 0]} />
        <Bar dataKey="despesas" name="Despesas" fill="#DA1E28" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
