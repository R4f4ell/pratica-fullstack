# Estudo Fullstack

Projeto fullstack para gerenciamento de estoque com frontend em React + TS e backend em FastAPI com Python, usando Supabase para persistência dos dados.

## Stack

- Frontend: React, TypeScript, Vite, Sass
- Backend: FastAPI, Pydantic, HTTPX, Pytest
- Banco/integração: Supabase REST API

## Estrutura

```text
estudo-fullstack/
├─ back-end/
│  ├─ core/
│  ├─ models/
│  ├─ repositories/
│  ├─ routers/
│  ├─ schemas/
│  ├─ services/
│  ├─ tests/
│  ├─ main.py
│  └─ requirements.txt
├─ front-end/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ pages/
│  │  ├─ styles/
│  │  └─ utils/
│  ├─ package.json
│  └─ vite.config.ts
└─ README.md
```

## Como rodar

### Backend

```bash
cd back-end
pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

### Frontend

```bash
cd front-end
npm install
npm run dev
```

## Funcionalidades

- listar produtos
- buscar produtos
- criar produto
- editar produto
- excluir produto

## Testes

Backend:

```bash
cd back-end
.\.venv\Scripts\python.exe -m pytest -v
```
