import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export default function CategoryPieChart({ data }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data?.length) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-neutral-500">
        Nenhuma despesa registrada
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={95}
          paddingAngle={2}
          stroke={isDark ? '#171717' : '#ffffff'}
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{
            background: isDark ? '#171717' : '#ffffff',
            border: `1px solid ${isDark ? '#404040' : '#e5e5e5'}`,
            borderRadius: 6,
            color: isDark ? '#f5f5f5' : '#171717',
          }}
          itemStyle={{ color: isDark ? '#f5f5f5' : '#171717' }}
        />
        <Legend
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => (
            <span style={{ color: isDark ? '#a3a3a3' : '#525252' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
