import { useEffect, useState } from 'react';
import { CATEGORY_ICON_MAP, CATEGORY_ICON_NAMES } from '../utils/categoryIcons';

const COLOR_OPTIONS = [
  '#DA1E28',
  '#059669',
  '#EA580C',
  '#2563EB',
  '#7C3AED',
  '#DB2777',
  '#CA8A04',
  '#0D9488',
  '#525252',
  '#0F172A',
];

const emptyForm = {
  name: '',
  type: 'despesa',
  color: '#DA1E28',
  icon: 'Tag',
};

export default function CategoryForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        type: initialData.type,
        color: initialData.color,
        icon: initialData.icon,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label-field">Nome</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field">Tipo</label>
        <select name="type" value={form.type} onChange={handleChange} className="input-field">
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
      </div>

      <div>
        <label className="label-field">Cor</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, color }))}
              className={`h-7 w-7 rounded border-2 transition-transform ${
                form.color === color
                  ? 'scale-110 border-neutral-900 dark:border-white'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="label-field">Ícone</label>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {CATEGORY_ICON_NAMES.map((iconName) => {
            const IconComponent = CATEGORY_ICON_MAP[iconName];
            const selected = form.icon === iconName;
            return (
              <button
                key={iconName}
                type="button"
                title={iconName}
                onClick={() => setForm((prev) => ({ ...prev, icon: iconName }))}
                className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
                  selected
                    ? 'border-brand bg-brand/10 text-brand'
                    : 'border-neutral-200 text-neutral-400 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800'
                }`}
              >
                <IconComponent size={17} weight={selected ? 'fill' : 'regular'} />
              </button>
            );
          })}
        </div>
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
