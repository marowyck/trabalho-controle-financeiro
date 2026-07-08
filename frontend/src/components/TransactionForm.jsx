import { useEffect, useState } from 'react';

const PAYMENT_OPTIONS = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'cartao_credito', label: 'Cartão de Crédito' },
  { value: 'cartao_debito', label: 'Cartão de Débito' },
  { value: 'pix', label: 'PIX' },
  { value: 'transferencia', label: 'Transferência' },
  { value: 'boleto', label: 'Boleto' },
];

const emptyForm = {
  description: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  type: 'despesa',
  category_id: '',
  payment_method: 'pix',
  status: 'pago',
  notes: '',
};

export default function TransactionForm({ initialData, categorias, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        description: initialData.description,
        amount: String(initialData.amount),
        date: initialData.date,
        type: initialData.type,
        category_id: String(initialData.category_id),
        payment_method: initialData.payment_method,
        status: initialData.status,
        notes: initialData.notes || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const filteredCategories = categorias.filter((c) => c.type === form.type);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'type') {
        updated.category_id = '';
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
      category_id: Number(form.category_id),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label-field">Descrição</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Valor (R$)</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={form.amount}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field">Data</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            className="input-field [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Tipo</label>
          <select name="type" value={form.type} onChange={handleChange} className="input-field">
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </div>
        <div>
          <label className="label-field">Categoria</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Selecione...</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Forma de Pagamento</label>
          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="input-field"
          >
            {PAYMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input-field">
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label-field">Observações</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="input-field resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}
