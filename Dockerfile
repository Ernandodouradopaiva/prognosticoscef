# Dockerfile para aplicação de Prognósticos CEF
# Multi-stage build para otimizar o tamanho da imagem

# Stage 1: Build do frontend React
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY index.html ./

# Copiar código fonte do frontend
COPY src/ ./src/
COPY public/ ./public/
COPY plugins/ ./plugins/

# Instalar dependências e fazer build
RUN npm ci --only=production
RUN npm run build

# Stage 2: Build do backend Node.js
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código do servidor
COPY server/ ./server/

# Stage 3: Imagem final
FROM node:18-alpine AS production

# Instalar dependências necessárias
RUN apk add --no-cache dumb-init

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copiar dependências do backend
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/server ./server

# Copiar build do frontend
COPY --from=frontend-builder /app/dist ./dist

# Copiar arquivos de configuração
COPY package*.json ./
COPY server.env ./

# Definir permissões
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expor porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando de inicialização
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/index.js"]
