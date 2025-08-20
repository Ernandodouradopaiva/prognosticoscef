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

async function checkTables() {
  try {
    console.log('🔍 Verificando tabelas no PostgreSQL...\n');
    
    const client = await pgPool.connect();
    
    // Listar todas as tabelas
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tabelas encontradas:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Verificar estrutura de cada tabela
    for (const row of result.rows) {
      const tableName = row.table_name;
      console.log(`\n📊 Estrutura da tabela: ${tableName}`);
      
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = '${tableName}' 
        ORDER BY ordinal_position
      `);
      
      columns.rows.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
      });
      
      // Contar registros
      const count = await client.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      console.log(`   Total de registros: ${count.rows[0].count}`);
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pgPool.end();
  }
}

checkTables(); 