import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configurar dotenv
dotenv.config({ path: './server.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do PostgreSQL
const pgPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso necessário' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rotas de autenticação
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, nome } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await pgPool.query(
      'SELECT * FROM auth.users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir novo usuário
    const newUser = await pgPool.query(
      'INSERT INTO auth.users (email, password, nome, role) VALUES ($1, $2, $3, $4) RETURNING id, email, nome, role',
      [email, hashedPassword, nome, 'Pendente']
    );

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: newUser.rows[0].id, 
        email: newUser.rows[0].email,
        role: newUser.rows[0].role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        nome: newUser.rows[0].nome,
        role: newUser.rows[0].role
      },
      token
    });
  } catch (error) {
    console.error('Erro no signup:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await pgPool.query(
      'SELECT * FROM auth.users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.rows[0].id, 
        email: user.rows[0].email,
        role: user.rows[0].role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        nome: user.rows[0].nome,
        role: user.rows[0].role
      },
      token
    });
  } catch (error) {
    console.error('Erro no signin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas de concursos
app.get('/api/concursos', async (req, res) => {
  try {
    const result = await pgPool.query(
      'SELECT * FROM concursos ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar concursos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/concursos', authenticateToken, async (req, res) => {
  try {
    const {
      concurso, data, bola1, bola2, bola3, bola4, bola5,
      bola6, bola7, bola8, bola9, bola10, bola11, bola12,
      bola13, bola14, bola15
    } = req.body;

    const result = await pgPool.query(
      `INSERT INTO concursos (
        concurso, data, bola1, bola2, bola3, bola4, bola5,
        bola6, bola7, bola8, bola9, bola10, bola11, bola12,
        bola13, bola14, bola15
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [concurso, data, bola1, bola2, bola3, bola4, bola5,
       bola6, bola7, bola8, bola9, bola10, bola11, bola12,
       bola13, bola14, bola15]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar concurso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/api/concursos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      concurso, data, bola1, bola2, bola3, bola4, bola5,
      bola6, bola7, bola8, bola9, bola10, bola11, bola12,
      bola13, bola14, bola15
    } = req.body;

    const result = await pgPool.query(
      `UPDATE concursos SET
        concurso = $1, data = $2, bola1 = $3, bola2 = $4, bola3 = $5, bola4 = $6, bola5 = $7,
        bola6 = $8, bola7 = $9, bola8 = $10, bola9 = $11, bola10 = $12, bola11 = $13, bola12 = $14,
        bola13 = $15, bola14 = $16, bola15 = $17, updated_at = NOW()
      WHERE id = $18 RETURNING *`,
      [concurso, data, bola1, bola2, bola3, bola4, bola5,
       bola6, bola7, bola8, bola9, bola10, bola11, bola12,
       bola13, bola14, bola15, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Concurso não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar concurso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/api/concursos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pgPool.query(
      'DELETE FROM concursos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Concurso não encontrado' });
    }

    res.json({ message: 'Concurso deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar concurso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas de prognósticos
app.get('/api/prognosticos/:tipo', async (req, res) => {
  try {
    const { tipo } = req.params;
    const tableName = `prognosticos_${tipo}`;
    
    const result = await pgPool.query(
      `SELECT * FROM ${tableName} ORDER BY gerado_em DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar prognósticos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/prog-geral', async (req, res) => {
  try {
    const result = await pgPool.query(
      'SELECT * FROM prog_geral ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar prognósticos gerais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/prog-geral', authenticateToken, async (req, res) => {
  try {
    const {
      bola1, bola2, bola3, bola4, bola5, bola6, bola7, bola8, bola9, bola10,
      bola11, bola12, bola13, bola14, bola15
    } = req.body;

    const result = await pgPool.query(
      `INSERT INTO prog_geral (
        bola1, bola2, bola3, bola4, bola5, bola6, bola7, bola8, bola9, bola10,
        bola11, bola12, bola13, bola14, bola15
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [bola1, bola2, bola3, bola4, bola5, bola6, bola7, bola8, bola9, bola10,
       bola11, bola12, bola13, bola14, bola15]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar prognóstico geral:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para gerenciamento de usuários (apenas admin)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const result = await pgPool.query(
      'SELECT id, email, nome, role, created_at FROM auth.users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/api/users/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { id } = req.params;
    const { role } = req.body;

    const result = await pgPool.query(
      'UPDATE auth.users SET role = $1 WHERE id = $2 RETURNING id, email, nome, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar status do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API disponível em: http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
}); 