require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
require('./migrate');

const DEMO_EMAIL = 'demo@controlefinanceiro.com';
const DEMO_PASSWORD = '123456';

const categories = [
  { name: 'Salário', type: 'receita', color: '#22c55e', icon: 'Money' },
  { name: 'Freelance', type: 'receita', color: '#10b981', icon: 'Briefcase' },
  { name: 'Alimentação', type: 'despesa', color: '#f97316', icon: 'ForkKnife' },
  { name: 'Transporte', type: 'despesa', color: '#3b82f6', icon: 'Car' },
  { name: 'Moradia', type: 'despesa', color: '#8b5cf6', icon: 'House' },
  { name: 'Lazer', type: 'despesa', color: '#ec4899', icon: 'GameController' },
];

function getMonthDate(monthsAgo, day) {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(day);
  return date.toISOString().split('T')[0];
}

function seed() {
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(DEMO_EMAIL);

  if (existingUser) {
    console.log('Dados de exemplo já existem. Seed ignorado.');
    return;
  }

  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);
  const userResult = db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run('Usuário Demo', DEMO_EMAIL, passwordHash);

  const userId = userResult.lastInsertRowid;

  const insertCategory = db.prepare(
    'INSERT INTO categories (user_id, name, type, color, icon) VALUES (?, ?, ?, ?, ?)'
  );

  const categoryIds = categories.map((cat) => {
    const result = insertCategory.run(userId, cat.name, cat.type, cat.color, cat.icon);
    return { ...cat, id: result.lastInsertRowid };
  });

  const receitaCats = categoryIds.filter((c) => c.type === 'receita');
  const despesaCats = categoryIds.filter((c) => c.type === 'despesa');

  const insertTransaction = db.prepare(
    `INSERT INTO transactions
      (user_id, category_id, description, amount, date, type, payment_method, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const transactions = [
  { cat: receitaCats[0], desc: 'Salário mensal', amount: 4500, monthsAgo: 0, day: 5, type: 'receita', payment: 'transferencia', status: 'pago' },
  { cat: receitaCats[1], desc: 'Projeto freelance', amount: 1200, monthsAgo: 1, day: 12, type: 'receita', payment: 'pix', status: 'pago' },
  { cat: despesaCats[0], desc: 'Supermercado', amount: 380.5, monthsAgo: 0, day: 8, type: 'despesa', payment: 'cartao_debito', status: 'pago' },
  { cat: despesaCats[1], desc: 'Combustível', amount: 220, monthsAgo: 0, day: 10, type: 'despesa', payment: 'pix', status: 'pago' },
  { cat: despesaCats[2], desc: 'Aluguel', amount: 1500, monthsAgo: 0, day: 3, type: 'despesa', payment: 'boleto', status: 'pago' },
  { cat: despesaCats[3], desc: 'Cinema', amount: 65, monthsAgo: 1, day: 18, type: 'despesa', payment: 'cartao_credito', status: 'pago' },
  { cat: despesaCats[0], desc: 'Restaurante', amount: 95, monthsAgo: 2, day: 14, type: 'despesa', payment: 'cartao_credito', status: 'pago' },
  { cat: receitaCats[0], desc: 'Salário mensal', amount: 4500, monthsAgo: 1, day: 5, type: 'receita', payment: 'transferencia', status: 'pago' },
  { cat: despesaCats[2], desc: 'Conta de luz', amount: 180, monthsAgo: 1, day: 15, type: 'despesa', payment: 'boleto', status: 'pendente', notes: 'Aguardando pagamento' },
  { cat: despesaCats[1], desc: 'Uber', amount: 35, monthsAgo: 3, day: 20, type: 'despesa', payment: 'pix', status: 'pago' },
  ];

  transactions.forEach((t) => {
    insertTransaction.run(
      userId,
      t.cat.id,
      t.desc,
      t.amount,
      getMonthDate(t.monthsAgo, t.day),
      t.type,
      t.payment,
      t.status,
      t.notes || null
    );
  });

  console.log('Seed concluído com sucesso!');
  console.log(`Login demo: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

seed();
