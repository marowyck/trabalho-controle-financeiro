import { useEffect, useState } from 'react';
import { ChartPie, ChartBar } from '@phosphor-icons/react';
import { transacaoApi } from '../api/transacaoApi';
import SummaryCards from '../components/SummaryCards';
import CategoryPieChart from '../components/CategoryPieChart';
import MonthlyBarChart from '../components/MonthlyBarChart';

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transacaoApi
      .resumo()
      .then(({ data }) => setResumo(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center text-sm text-neutral-500">Carregando dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-500">Visão geral das suas finanças</p>
      </div>

      <SummaryCards data={resumo} />

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="surface rounded-md p-6">
          <div className="mb-4 flex items-center gap-2">
            <ChartPie size={18} className="text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Despesas por Categoria
            </h2>
          </div>
          <CategoryPieChart data={resumo.despesas_por_categoria} />
        </div>

        <div className="surface rounded-md p-6">
          <div className="mb-4 flex items-center gap-2">
            <ChartBar size={18} className="text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Receitas x Despesas (6 meses)
            </h2>
          </div>
          <MonthlyBarChart data={resumo.totais_por_mes} />
        </div>
      </div>
    </div>
  );
}
