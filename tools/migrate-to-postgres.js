import { createClient } from '@supabase/supabase-js';
import pkg from 'pg';
const { Pool } = pkg;

// Configuração Supabase (origem)
const supabaseUrl = 'https://nmvjayskvfunvcxsetel.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tdmpheXNrdmZ1bnZjeHNldGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTYzNTIsImV4cCI6MjA2NDI5MjM1Mn0.EZxGLgg2scfdMJort_CT_Q8mTL-wSlRecIugKPTV0KU';

// Configuração PostgreSQL (destino)
const pgConfig = {
  user: 'postgres',
  host: '172.20.13.82',
  database: 'loteria_db',
  password: '@re55p5230',
  port: 5432,
};

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const pgPool = new Pool(pgConfig);

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com PostgreSQL...');
    console.log(`   Host: ${pgConfig.host}:${pgConfig.port}`);
    console.log(`   Database: ${pgConfig.database}`);
    console.log(`   User: ${pgConfig.user}`);
    
    const client = await pgPool.connect();
    const result = await client.query('SELECT version()');
    console.log('✅ Conexão bem-sucedida!');
    console.log(`📊 Versão: ${result.rows[0].version.split(',')[0]}`);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    return false;
  }
}

async function migrateConcursos() {
  try {
    console.log('\n📊 Migrando tabela: concursos');
    
    // Buscar dados do Supabase
    const { data: concursos, error } = await supabase
      .from('concursos')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar concursos do Supabase:', error);
      return;
    }

    if (!concursos || concursos.length === 0) {
      console.log('ℹ️ Nenhum concurso encontrado no Supabase');
      return;
    }

    console.log(`📥 Encontrados ${concursos.length} concursos no Supabase`);

    // Limpar tabela de destino
    await pgPool.query('DELETE FROM concursos');

    // Inserir dados no PostgreSQL
    for (const concurso of concursos) {
      const { id, created_at, updated_at, ...concursoData } = concurso;
      
      const insertQuery = `
        INSERT INTO concursos (
          concurso, data, bola1, bola2, bola3, bola4, bola5, 
          bola6, bola7, bola8, bola9, bola10, bola11, bola12, 
          bola13, bola14, bola15, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      `;

      const values = [
        concursoData.concurso,
        concursoData.data,
        concursoData.bola1, concursoData.bola2, concursoData.bola3, concursoData.bola4, concursoData.bola5,
        concursoData.bola6, concursoData.bola7, concursoData.bola8, concursoData.bola9, concursoData.bola10,
        concursoData.bola11, concursoData.bola12, concursoData.bola13, concursoData.bola14, concursoData.bola15,
        created_at, updated_at
      ];

      await pgPool.query(insertQuery, values);
    }

    console.log(`✅ ${concursos.length} concursos migrados com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao migrar concursos:', error);
  }
}

async function migratePrognosticos() {
  const tables = [
    'prognosticos_top_10',
    'prognosticos_top_20', 
    'prognosticos_top_30',
    'prognosticos_top_50',
    'prognosticos_top_100'
  ];
  
  for (const table of tables) {
    try {
      console.log(`\n📊 Migrando tabela: ${table}`);
      
      // Buscar dados do Supabase
      const { data: prognosticos, error } = await supabase
        .from(table)
        .select('*')
        .order('gerado_em', { ascending: true });

      if (error) {
        console.error(`❌ Erro ao buscar ${table} do Supabase:`, error);
        continue;
      }

      if (!prognosticos || prognosticos.length === 0) {
        console.log(`ℹ️ Nenhum registro encontrado em ${table}`);
        continue;
      }

      console.log(`📥 Encontrados ${prognosticos.length} registros em ${table}`);

      // Limpar tabela de destino
      await pgPool.query(`DELETE FROM ${table}`);

      // Inserir dados no PostgreSQL
      for (const prognostico of prognosticos) {
        const { id, ...prognosticoData } = prognostico;
        
        const insertQuery = `
          INSERT INTO ${table} (
            bola1, bola2, bola3, bola4, bola5, bola6, bola7, bola8, bola9, bola10,
            bola11, bola12, bola13, bola14, bola15, gerado_em
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `;

        const values = [
          prognosticoData.bola1, prognosticoData.bola2, prognosticoData.bola3, prognosticoData.bola4, prognosticoData.bola5,
          prognosticoData.bola6, prognosticoData.bola7, prognosticoData.bola8, prognosticoData.bola9, prognosticoData.bola10,
          prognosticoData.bola11, prognosticoData.bola12, prognosticoData.bola13, prognosticoData.bola14, prognosticoData.bola15,
          prognosticoData.gerado_em
        ];

        await pgPool.query(insertQuery, values);
      }

      console.log(`✅ ${prognosticos.length} registros migrados de ${table}`);
    } catch (error) {
      console.error(`❌ Erro ao migrar ${table}:`, error);
    }
  }
}

async function migrateProgGeral() {
  try {
    console.log('\n📊 Migrando tabela: prog_geral');
    
    // Buscar dados do Supabase
    const { data: prognosticos, error } = await supabase
      .from('prog_geral')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar prog_geral do Supabase:', error);
      return;
    }

    if (!prognosticos || prognosticos.length === 0) {
      console.log('ℹ️ Nenhum registro encontrado em prog_geral');
      return;
    }

    console.log(`📥 Encontrados ${prognosticos.length} registros em prog_geral`);

    // Limpar tabela de destino
    await pgPool.query('DELETE FROM prog_geral');

    // Inserir dados no PostgreSQL
    for (const prognostico of prognosticos) {
      const { id, created_at, ...prognosticoData } = prognostico;
      
      const insertQuery = `
        INSERT INTO prog_geral (
          bola1, bola2, bola3, bola4, bola5, bola6, bola7, bola8, bola9, bola10,
          bola11, bola12, bola13, bola14, bola15, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `;

      const values = [
        prognosticoData.bola1, prognosticoData.bola2, prognosticoData.bola3, prognosticoData.bola4, prognosticoData.bola5,
        prognosticoData.bola6, prognosticoData.bola7, prognosticoData.bola8, prognosticoData.bola9, prognosticoData.bola10,
        prognosticoData.bola11, prognosticoData.bola12, prognosticoData.bola13, prognosticoData.bola14, prognosticoData.bola15,
        created_at
      ];

      await pgPool.query(insertQuery, values);
    }

    console.log(`✅ ${prognosticos.length} registros migrados de prog_geral`);
  } catch (error) {
    console.error('❌ Erro ao migrar prog_geral:', error);
  }
}

async function showMigrationSummary() {
  try {
    console.log('\n📊 Resumo da Migração:');
    
    const tables = ['concursos', 'prog_geral', 'prognosticos_top_10', 'prognosticos_top_20', 'prognosticos_top_30', 'prognosticos_top_50', 'prognosticos_top_100'];
    
    for (const table of tables) {
      const result = await pgPool.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`   ${table}: ${result.rows[0].count} registros`);
    }
  } catch (error) {
    console.error('❌ Erro ao gerar resumo:', error);
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando migração do Supabase para PostgreSQL...\n');
    
    // Testar conexão
    const connectionOk = await testConnection();
    if (!connectionOk) {
      console.log('\n❌ Falha na conexão. Verifique as credenciais e tente novamente.');
      return;
    }
    
    // Executar migrações
    await migrateConcursos();
    await migratePrognosticos();
    await migrateProgGeral();
    
    // Mostrar resumo
    await showMigrationSummary();
    
    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('📋 Dados migrados:');
    console.log('   - concursos');
    console.log('   - prog_geral');
    console.log('   - prognosticos_top_10');
    console.log('   - prognosticos_top_20');
    console.log('   - prognosticos_top_30');
    console.log('   - prognosticos_top_50');
    console.log('   - prognosticos_top_100');
    
  } catch (error) {
    console.error('\n💥 Erro durante a migração:', error);
  } finally {
    await pgPool.end();
  }
}

main(); 