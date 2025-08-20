import pkg from 'pg';
const { Pool } = pkg;

// Configuração PostgreSQL
const pgConfig = {
  user: 'postgres',
  host: '172.20.13.82',
  database: 'loteria_db',
  password: '@re55p5230',
  port: 5432,
};

const pgPool = new Pool(pgConfig);

async function createUsersTable() {
  try {
    console.log('🔧 Criando schema auth e tabela users...\n');
    
    const client = await pgPool.connect();
    
    // Criar schema auth se não existir
    await client.query('CREATE SCHEMA IF NOT EXISTS auth');
    
    // Criar tabela users
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS auth.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'Pendente' CHECK (role IN ('Admin', 'Pendente')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    
    await client.query(createTableQuery);
    console.log('✅ Tabela auth.users criada com sucesso!');
    
    // Criar usuário admin padrão
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('admin123', 10);
    
    const adminUser = await client.query(
      'SELECT * FROM auth.users WHERE email = $1',
      ['admin@loteria.com']
    );
    
    if (adminUser.rows.length === 0) {
      await client.query(
        'INSERT INTO auth.users (email, password, nome, role) VALUES ($1, $2, $3, $4)',
        ['admin@loteria.com', hashedPassword, 'Administrador', 'Admin']
      );
      console.log('✅ Usuário admin criado: admin@loteria.com / admin123');
    } else {
      console.log('ℹ️ Usuário admin já existe');
    }
    
    // Verificar estrutura da tabela
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'auth' AND table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📊 Estrutura da tabela auth.users:');
    columns.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
    });
    
    // Contar usuários
    const count = await client.query('SELECT COUNT(*) as count FROM auth.users');
    console.log(`\n👥 Total de usuários: ${count.rows[0].count}`);
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pgPool.end();
  }
}

createUsersTable(); 