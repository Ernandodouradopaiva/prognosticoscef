import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';

// Configuração PostgreSQL
const pgConfig = {
  user: 'postgres',
  host: '172.20.13.82',
  database: 'loteria_db',
  password: '@re55p5230',
  port: 5432,
};

const pgPool = new Pool(pgConfig);

async function createAdminUser() {
  try {
    console.log('🔧 Criando usuário admin...\n');
    
    const client = await pgPool.connect();
    
    // Verificar se o usuário já existe
    const existingUser = await client.query(
      'SELECT * FROM auth.users WHERE email = $1',
      ['ernandodourado7@gmail.com']
    );
    
    if (existingUser.rows.length > 0) {
      console.log('ℹ️ Usuário admin já existe');
      
      // Atualizar para Admin se não for
      if (existingUser.rows[0].role !== 'Admin') {
        await client.query(
          'UPDATE auth.users SET role = $1 WHERE email = $2',
          ['Admin', 'ernandodourado7@gmail.com']
        );
        console.log('✅ Usuário atualizado para Admin');
      }
    } else {
      // Criar hash da senha
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Inserir usuário admin
      await client.query(
        'INSERT INTO auth.users (email, password, nome, role) VALUES ($1, $2, $3, $4)',
        ['ernandodourado7@gmail.com', hashedPassword, 'Ernando Dourado', 'Admin']
      );
      console.log('✅ Usuário admin criado: ernandodourado7@gmail.com / admin123');
    }
    
    // Verificar usuários
    const users = await client.query('SELECT email, nome, role FROM auth.users ORDER BY created_at');
    console.log('\n👥 Usuários no sistema:');
    users.rows.forEach(user => {
      console.log(`   ${user.email} - ${user.nome} (${user.role})`);
    });
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pgPool.end();
  }
}

createAdminUser(); 