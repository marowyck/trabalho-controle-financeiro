# Sistema de Controle Financeiro

Sistema web completo para gestão financeira pessoal, desenvolvido como projeto avaliativo da disciplina Programação II – Web (UEMG).

## Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| Front-end | React, Vite, Tailwind CSS, Phosphor Icons, Recharts, Axios, React Router |
| Back-end | Node.js, Express, JWT, bcryptjs |
| Banco de Dados | SQLite (módulo nativo `node:sqlite` do Node.js 22+) |

## Funcionalidades

- **Autenticação**: cadastro e login de usuários com JWT
- **Dashboard**: cards de resumo (saldo, receitas, despesas) + gráficos de pizza e barras
- **CRUD de Categorias**: criar, listar, editar e excluir categorias de receita/despesa
- **CRUD de Transações**: criar, listar, editar e excluir transações com filtros
- **Campos extras**: forma de pagamento, status (pago/pendente) e observações
- **Responsividade**: interface adaptada para desktop e mobile

## Estrutura do Projeto

```
trabalho-dudu/
├── backend/          # API REST (Node.js + Express)
├── frontend/         # Interface (React + Tailwind)
├── README.md
└── .gitignore
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão 22 ou superior (recomendado 24+)
- npm

## Como Executar

### 1. Configurar o Back-end

```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

O servidor iniciará em **http://localhost:3001**

### 2. Configurar o Front-end

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**

### 3. Acesso Demo

Após executar o seed, utilize as credenciais:

- **E-mail:** `demo@controlefinanceiro.com`
- **Senha:** `123456`

## Banco de Dados

O arquivo de criação do banco está em `backend/src/database/schema.sql`.

Para recriar o banco do zero:

```bash
cd backend
rm database.sqlite
npm run migrate
npm run seed
```

## Endpoints da API

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Cadastra novo usuário |
| POST | `/api/auth/login` | Realiza login e retorna JWT |

**Exemplo de registro:**
```json
POST /api/auth/register
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

**Exemplo de login:**
```json
POST /api/auth/login
{
  "email": "joao@email.com",
  "password": "123456"
}
```

### Categorias (requer autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/categorias/listar` | Lista todas as categorias do usuário |
| GET | `/api/categorias/buscar/:id` | Busca uma categoria por ID |
| POST | `/api/categorias/salvar` | Cadastra nova categoria |
| PUT | `/api/categorias/editar/:id` | Atualiza categoria existente |
| DELETE | `/api/categorias/deletar/:id` | Exclui categoria |

**Exemplo de criação:**
```json
POST /api/categorias/salvar
Authorization: Bearer <token>
{
  "name": "Alimentação",
  "type": "despesa",
  "color": "#f97316",
  "icon": "ForkKnife"
}
```

### Transações (requer autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/transacoes/listar` | Lista transações (aceita filtros via query params) |
| GET | `/api/transacoes/buscar/:id` | Busca transação por ID |
| POST | `/api/transacoes/salvar` | Cadastra nova transação |
| PUT | `/api/transacoes/editar/:id` | Atualiza transação existente |
| DELETE | `/api/transacoes/deletar/:id` | Exclui transação |
| GET | `/api/transacoes/resumo` | Retorna dados agregados para o dashboard |

**Query params para listagem:** `tipo`, `categoria_id`, `status`, `data_inicio`, `data_fim`

**Exemplo de criação:**
```json
POST /api/transacoes/salvar
Authorization: Bearer <token>
{
  "description": "Supermercado",
  "amount": 150.50,
  "date": "2026-07-08",
  "type": "despesa",
  "category_id": 3,
  "payment_method": "pix",
  "status": "pago",
  "notes": "Compras da semana"
}
```

## Autor

Maria Olívia Cassucci dos Santos
Projeto desenvolvido para a disciplina Programação II – Web, UEMG Unidade Passos.
