# Docker - Sistema de Prognósticos CEF

## Configuração para Produção

Este sistema está configurado para usar o banco de dados PostgreSQL de produção:
- **IP**: 181.215.134.218:5432
- **Banco**: loteria_db
- **Usuário**: postgres
- **Senha**: @Systemcode236

## Estrutura dos Arquivos Docker

- `Dockerfile` - Configuração multi-stage para build da aplicação
- `docker-compose.yml` - Orquestração dos serviços
- `nginx.conf` - Configuração do proxy reverso
- `.dockerignore` - Arquivos excluídos do build
- `server.env` - Variáveis de ambiente do servidor

## Como Executar

### 1. Build e Execução Completa
```bash
# Build e start de todos os serviços
docker-compose up --build

# Executar em background
docker-compose up -d --build
```

### 2. Apenas a Aplicação (sem Nginx)
```bash
# Executar apenas o app
docker-compose up app --build
```

### 3. Verificar Status
```bash
# Ver logs
docker-compose logs -f app

# Ver status dos containers
docker-compose ps
```

### 4. Parar Serviços
```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (se houver)
docker-compose down -v
```

## Portas Utilizadas

- **3001** - Aplicação Node.js/React
- **80** - Nginx (proxy reverso)
- **443** - Nginx (HTTPS - opcional)

## Acessos

- **Aplicação**: http://localhost:3001
- **Via Nginx**: http://localhost:80
- **Health Check**: http://localhost:3001/api/health

## Configurações de Ambiente

As variáveis de ambiente estão definidas no `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - DB_USER=postgres
  - DB_HOST=181.215.134.218
  - DB_NAME=loteria_db
  - DB_PASSWORD=@Systemcode236
  - DB_PORT=5432
  - JWT_SECRET=seu_jwt_secret_super_seguro_aqui_123456789
  - PORT=3001
```

## Health Checks

O sistema inclui health checks automáticos:
- **Aplicação**: Verifica endpoint `/api/health`
- **Banco**: Conectividade com PostgreSQL de produção

## Logs

Os logs podem ser acessados via:
```bash
# Logs da aplicação
docker-compose logs app

# Logs do Nginx
docker-compose logs nginx

# Logs em tempo real
docker-compose logs -f
```

## Troubleshooting

### Problemas de Conexão com Banco
1. Verificar se o IP 181.215.134.218 está acessível
2. Confirmar se a porta 5432 está liberada
3. Verificar credenciais no `server.env`

### Problemas de Build
1. Limpar cache: `docker system prune -a`
2. Rebuild sem cache: `docker-compose build --no-cache`

### Problemas de Porta
1. Verificar se as portas 3001, 80, 443 estão livres
2. Alterar portas no `docker-compose.yml` se necessário

## Segurança

- A aplicação roda como usuário não-root (nodejs)
- Headers de segurança configurados no Nginx
- Rate limiting aplicado nas APIs
- JWT secret configurado via variável de ambiente

## Backup e Restore

Para backup do banco de produção:
```bash
# Backup
pg_dump -h 181.215.134.218 -U postgres -d loteria_db > backup.sql

# Restore
psql -h 181.215.134.218 -U postgres -d loteria_db < backup.sql
```
