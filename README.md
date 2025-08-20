# Sistema de Prognósticos CEF

Sistema web para gerenciamento de prognósticos da loteria CEF, desenvolvido com React e PostgreSQL.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Radix UI** - Componentes de interface
- **Tailwind CSS** - Framework CSS
- **Framer Motion** - Animações
- **XLSX** - Manipulação de arquivos Excel/CSV

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **pg** - Cliente PostgreSQL para Node.js

## 📋 Funcionalidades

- **Autenticação**: Sistema de login/logout com JWT
- **Gestão de Usuários**: Cadastro e controle de acesso
- **Concursos**: Registro e visualização de resultados
- **Prognósticos**: Upload e visualização de prognósticos
- **Dashboard**: Interface administrativa

## 🛠️ Instalação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- PostgreSQL
- npm ou yarn

### Configuração

1. **Clone o repositório**
```bash
git clone https://github.com/Ernandodouradopaiva/prognosticoscef.git
cd prognosticoscef
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados PostgreSQL**
- Crie um banco de dados chamado `loteria_db`
- Configure as credenciais no arquivo `server.env`

4. **Configure as variáveis de ambiente**
Crie um arquivo `server.env` na raiz do projeto:
```env
DB_USER=postgres
DB_HOST=172.20.13.82
DB_NAME=loteria_db
DB_PASSWORD=sua_senha
DB_PORT=5432
JWT_SECRET=seu_jwt_secret
PORT=3001
NODE_ENV=development
```

5. **Execute os scripts de inicialização**
```bash
# Criar tabelas e usuário admin
node tools/create-admin-user.js
```

## 🚀 Executando o Projeto

### Desenvolvimento

1. **Inicie o backend**
```bash
node server/index.js
```

2. **Inicie o frontend** (em outro terminal)
```bash
npm run dev
```

3. **Acesse a aplicação**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

### Credenciais de Acesso
- **Email**: ernandodourado7@gmail.com
- **Senha**: admin123

## 📁 Estrutura do Projeto

```
prognosticoscef/
├── src/
│   ├── components/     # Componentes React
│   ├── contexts/       # Contextos (Auth)
│   ├── hooks/          # Custom hooks
│   ├── lib/           # Bibliotecas e clientes
│   ├── pages/         # Páginas da aplicação
│   └── main.jsx       # Entry point
├── server/
│   └── index.js       # Servidor Express
├── tools/             # Scripts utilitários
├── public/            # Arquivos estáticos
└── package.json
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção

## 📊 Banco de Dados

### Tabelas Principais
- `auth.users` - Usuários do sistema
- `concursos` - Resultados dos concursos
- `prog_geral` - Prognósticos gerais
- `prognosticos_top_X` - Prognósticos por categoria (10, 20, 30, 50, 100)

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:
- Tokens são armazenados no localStorage
- Expiração configurada para 24 horas
- Middleware de autenticação para rotas protegidas

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/signup` - Cadastro de usuário
- `POST /api/auth/signin` - Login

### Concursos
- `GET /api/concursos` - Listar concursos
- `POST /api/concursos` - Criar concurso
- `PUT /api/concursos/:id` - Atualizar concurso
- `DELETE /api/concursos/:id` - Deletar concurso

### Prognósticos
- `GET /api/prognosticos/:tipo` - Listar prognósticos por tipo
- `GET /api/prog-geral` - Listar prognósticos gerais
- `POST /api/prog-geral` - Criar prognóstico geral

### Usuários (Admin)
- `GET /api/users` - Listar usuários
- `PUT /api/users/:id/status` - Atualizar status do usuário

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Ernando Dourado Paiva**
- GitHub: [@Ernandodouradopaiva](https://github.com/Ernandodouradopaiva)

## 📞 Suporte

Para suporte, envie um email para ernandodourado7@gmail.com ou abra uma issue no GitHub.
