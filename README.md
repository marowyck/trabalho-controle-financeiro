<div align="center">

# iFinance

**Sistema de Controle Financeiro Pessoal**

![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-node:sqlite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![UEMG](https://img.shields.io/badge/UEMG-Passos-004A8B?style=flat-square)

Aplicação web full-stack para gestão financeira pessoal — controle de receitas, despesas, categorias e muito mais.

*Projeto avaliativo da disciplina **Programação II – Web** · UEMG Unidade Passos*

</div>

---

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Como Executar](#como-executar)
- [Banco de Dados](#banco-de-dados)
- [Endpoints da API](#endpoints-da-api)
- [Autora](#autora)

---

## Sobre o Projeto

O **iFinance** é um sistema web completo para gestão financeira pessoal. Permite cadastrar receitas e despesas, organizá-las por categorias personalizadas e visualizar a evolução do saldo por meio de gráficos interativos. O projeto foi desenvolvido com foco em boas práticas de desenvolvimento, separação de responsabilidades entre frontend e backend, autenticação segura via JWT e interface moderna e responsiva.

---

## Funcionalidades

### 🔐 Autenticação
- Cadastro de novos usuários com senha criptografada (bcryptjs)
- Login com geração de token JWT
- Rotas protegidas no frontend e no backend

### 📊 Dashboard
- Cards com resumo de saldo, total de receitas e total de despesas
- Gráfico de pizza com distribuição de despesas por categoria
- Gráfico de barras com evolução mensal de receitas e despesas
- Gráfico de linha com evolução do saldo

### 🗂️ Categorias
- Criar, editar, listar e excluir categorias
- Cada categoria possui nome, tipo (receita ou despesa), cor e ícone personalizados

### 💸 Transações
- Criar, editar, listar e excluir transações
- Filtros por tipo, categoria, status e período (data início / data fim)
- Campos extras: forma de pagamento, status (pago/pendente) e observações

### 🎨 Interface
- Design responsivo para desktop e mobile
- Suporte a tema claro e escuro
- Animações com Framer Motion
- Tela de splash na abertura

---

## Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| **Front-end** | React 18, Vite 6, Tailwind CSS, Phosphor Icons, Recharts, Framer Motion, Axios, React Router v6 |
| **Back-end** | Node.js 22+, Express, JWT (`jsonwebtoken`), bcryptjs, CORS, dotenv |
| **Banco de Dados** | SQLite via módulo nativo `node:sqlite` (Node.js 22+) |

---

## Estrutura do Projeto

```
trabalho-dudu/
├── backend/
│   └── src/
│       ├── config/         # Conexão com o banco de dados
│       ├── controllers/    # Lógica de negócio (auth, categorias, transações)
│       ├── database/       # Schema SQL, migrate e seed
│       ├── middleware/     # Autenticação JWT
│       └── routes/         # Definição das rotas da API
├── frontend/
│   └── src/
│       ├── api/            # Chamadas HTTP (axios)
│       ├── components/     # Componentes reutilizáveis (Layout, Charts, Forms...)
│       ├── context/        # AuthContext, ThemeContext
│       ├── pages/          # Dashboard, Login, Register, Categorias, Transações
│       └── utils/          # Utilitários (ícones de categoria, etc.)
├── README.md
└── .gitignore
```

---

## Pré-requisitos

> ⚠️ **Importante:** O backend usa o módulo nativo `node:sqlite`, disponível **apenas no Node.js 22 ou superior**. Versões anteriores **não são suportadas**.

- [Node.js](https://nodejs.org/) versão **22+** (recomendado: 24+)
- npm (incluído com o Node.js)

---

## Como Executar

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd trabalho-dudu
```

### 2. Configurar o Back-end

```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

O servidor estará disponível em **http://localhost:3001**

Variáveis de ambiente do backend (`.env`):

```env
PORT=3001
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar o Front-end

Em um **novo terminal**:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**

Variáveis de ambiente do frontend (`.env`):

```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Acesso Demo

Após executar o `seed`, utilize as credenciais abaixo para acessar a conta de demonstração:

> **E-mail:** `demo@controlefinanceiro.com`
> **Senha:** `123456`

---

## Banco de Dados

O esquema do banco está definido em `backend/src/database/schema.sql`.

Para recriar o banco do zero (apaga todos os dados):

```bash
cd backend
rm database.sqlite
npm run migrate
npm run seed
```

---

## Endpoints da API

### 🔐 Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/auth/register` | Cadastra novo usuário |
| `POST` | `/api/auth/login` | Realiza login e retorna JWT |

<details>
<summary>Ver exemplos de requisição</summary>

**Registro:**
```json
POST /api/auth/register

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

**Login:**
```json
POST /api/auth/login

{
  "email": "joao@email.com",
  "password": "123456"
}
```

</details>

---

### 🗂️ Categorias

> Todas as rotas abaixo exigem o header `Authorization: Bearer <token>`.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/categorias/listar` | Lista todas as categorias do usuário |
| `GET` | `/api/categorias/buscar/:id` | Busca uma categoria por ID |
| `POST` | `/api/categorias/salvar` | Cadastra nova categoria |
| `PUT` | `/api/categorias/editar/:id` | Atualiza categoria existente |
| `DELETE` | `/api/categorias/deletar/:id` | Exclui categoria |

<details>
<summary>Ver exemplo de requisição</summary>

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

</details>

---

### 💸 Transações

> Todas as rotas abaixo exigem o header `Authorization: Bearer <token>`.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/transacoes/listar` | Lista transações (aceita filtros via query params) |
| `GET` | `/api/transacoes/buscar/:id` | Busca transação por ID |
| `POST` | `/api/transacoes/salvar` | Cadastra nova transação |
| `PUT` | `/api/transacoes/editar/:id` | Atualiza transação existente |
| `DELETE` | `/api/transacoes/deletar/:id` | Exclui transação |
| `GET` | `/api/transacoes/resumo` | Retorna dados agregados para o dashboard |

**Query params disponíveis para listagem:** `tipo`, `categoria_id`, `status`, `data_inicio`, `data_fim`

<details>
<summary>Ver exemplo de requisição</summary>

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

</details>

---

## Autora

**Maria Olívia Cassucci dos Santos**

*Projeto desenvolvido para a disciplina **Programação II – Web** · UEMG Unidade Passos*

---

<div align="center">
  <sub>Feito com dedicação para a disciplina de Programação II – Web · UEMG</sub>
</div>
