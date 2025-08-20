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

// Dados de exemplo para concursos
const sampleConcursos = [
  {
    concurso: 'EX2024001',
    data: '2024-01-15',
    bola1: 1, bola2: 5, bola3: 10, bola4: 15, bola5: 20,
    bola6: 25, bola7: 30, bola8: 35, bola9: 40, bola10: 45,
    bola11: 50, bola12: 55, bola13: 58, bola14: 59, bola15: 60
  },
  {
    concurso: 'EX2024002',
    data: '2024-01-16',
    bola1: 2, bola2: 7, bola3: 12, bola4: 17, bola5: 22,
    bola6: 27, bola7: 32, bola8: 37, bola9: 42, bola10: 47,
    bola11: 52, bola12: 57, bola13: 58, bola14: 59, bola15: 60
  },
  {
    concurso: 'EX2024003',
    data: '2024-01-17',
    bola1: 3, bola2: 8, bola3: 13, bola4: 18, bola5: 23,
    bola6: 28, bola7: 33, bola8: 38, bola9: 43, bola10: 48,
    bola11: 53, bola12: 56, bola13: 57, bola14: 58, bola15: 59
  }
];

// Dados de exemplo para prognósticos
const samplePrognosticos = [
  {
    bola1: 1, bola2: 4, bola3: 7, bola4: 10, bola5: 13,
    bola6: 16, bola7: 19, bola8: 22, bola9: 25, bola10: 28,
    bola11: 31, bola12: 34, bola13: 37, bola14: 40, bola15: 43
  },
  {
    bola1: 2, bola2: 5, bola3: 8, bola4: 11, bola5: 14,
    bola6: 17, bola7: 20, bola8: 23, bola9: 26, bola10: 29,
    bola11: 32, bola12: 35, bola13: 38, bola14: 41, bola15: 44
  },
  {
    bola1: 3, bola2: 6, bola3: 9, bola4: 12, bola5: 15,
    bola6: 18, bola7: 21, bola8: 24, bola9: 27, bola10: 30,
    bola11: 33, bola12: 36, bola13: 39, bola14: 42, bola15: 45
  }
];

async function insertSampleData() {
  try {
    console.log('🚀 Inserindo dados de exemplo no PostgreSQL...\n');
    
    // Inserir concursos
    console.log('📊 Inserindo concursos...');
    for (const concurso of sampleConcursos) {
      const insertQuery = `
        INSERT INTO concursos (
          concurso, data, bola1, bola2, bola3, bola4, bola5, 
          bola6, bola7, bola8, bola9, bola10, bola11, bola12, 
          bola13, bola14, bola15
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      `;

      const values = [
        concurso.concurso,
        concurso.data,
        concurso.bola1, concurso.bola2, concurso.bola3, concurso.bola4, concurso.bola5,
        concurso.bola6, concurso.bola7, concurso.bola8, concurso.bola9, concurso.bola10,
        concurso.bola11, concurso.bola12, concurso.bola13, concurso.bola14, concurso.bola15
      ];

      await pgPool.query(insertQuery, values);
    }
    console.log(`✅ ${sampleConcursos.length} concursos inseridos`);
    
    // Inserir prognósticos gerais
    console.log('\n📊 Inserindo prognósticos gerais...');
    for (const prognostico of samplePrognosticos) {
      const insertQuery = `
        INSERT INTO prog_geral (
          bola1, bola2, bola3, bola4, bola5, bola6, bola7, bola8, bola9, bola10,
          bola11, bola12, bola13, bola14, bola15
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `;

      const values = [
        prognostico.bola1, prognostico.bola2, prognostico.bola3, prognostico.bola4, prognostico.bola5,
        prognostico.bola6, prognostico.bola7, prognostico.bola8, prognostico.bola9, prognostico.bola10,
        prognostico.bola11, prognostico.bola12, prognostico.bola13, prognostico.bola14, prognostico.bola15
      ];

      await pgPool.query(insertQuery, values);
    }
    console.log(`✅ ${samplePrognosticos.length} prognósticos gerais inseridos`);
    
    // Inserir prognósticos top 10
    console.log('\n📊 Inserindo prognósticos top 10...');
    for (const prognostico of samplePrognosticos) {
      const insertQuery = `
        INSERT INTO prognosticos_top_10 (
          bola1, bola2, bola3, bola4, bola5, bola6, bola7, bola8, bola9, bola10,
          bola11, bola12, bola13, bola14, bola15, gerado_em
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `;

      const values = [
        prognostico.bola1, prognostico.bola2, prognostico.bola3, prognostico.bola4, prognostico.bola5,
        prognostico.bola6, prognostico.bola7, prognostico.bola8, prognostico.bola9, prognostico.bola10,
        prognostico.bola11, prognostico.bola12, prognostico.bola13, prognostico.bola14, prognostico.bola15,
        new Date().toISOString()
      ];

      await pgPool.query(insertQuery, values);
    }
    console.log(`✅ ${samplePrognosticos.length} prognósticos top 10 inseridos`);
    
    // Inserir prognósticos top 20
    console.log('\n📊 Inserindo prognósticos top 20...');
    for (const prognostico of samplePrognosticos) {
      const insertQuery = `
        INSERT INTO prognosticos_top_20 (
          bola1, bola2, bola3, bola4, bola5, bola6, bola7, bola8, bola9, bola10,
          bola11, bola12, bola13, bola14, bola15, gerado_em
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `;

      const values = [
        prognostico.bola1, prognostico.bola2, prognostico.bola3, prognostico.bola4, prognostico.bola5,
        prognostico.bola6, prognostico.bola7, prognostico.bola8, prognostico.bola9, prognostico.bola10,
        prognostico.bola11, prognostico.bola12, prognostico.bola13, prognostico.bola14, prognostico.bola15,
        new Date().toISOString()
      ];

      await pgPool.query(insertQuery, values);
    }
    console.log(`✅ ${samplePrognosticos.length} prognósticos top 20 inseridos`);
    
    // Inserir prognósticos top 50
    console.log('\n📊 Inserindo prognósticos top 50...');
    for (const prognostico of samplePrognosticos) {
      const insertQuery = `
        INSERT INTO prognosticos_top_50 (
          bola1, bola2, bola3, bola4, bola5, bola6, bola7, bola8, bola9, bola10,
          bola11, bola12, bola13, bola14, bola15, gerado_em
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `;

      const values = [
        prognostico.bola1, prognostico.bola2, prognostico.bola3, prognostico.bola4, prognostico.bola5,
        prognostico.bola6, prognostico.bola7, prognostico.bola8, prognostico.bola9, prognostico.bola10,
        prognostico.bola11, prognostico.bola12, prognostico.bola13, prognostico.bola14, prognostico.bola15,
        new Date().toISOString()
      ];

      await pgPool.query(insertQuery, values);
    }
    console.log(`✅ ${samplePrognosticos.length} prognósticos top 50 inseridos`);
    
    // Inserir prognósticos top 100
    console.log('\n📊 Inserindo prognósticos top 100...');
    for (const prognostico of samplePrognosticos) {
      const insertQuery = `
        INSERT INTO prognosticos_top_100 (
          bola1, bola2, bola3, bola4, bola5, bola6, bola7, bola8, bola9, bola10,
          bola11, bola12, bola13, bola14, bola15, gerado_em
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `;

      const values = [
        prognostico.bola1, prognostico.bola2, prognostico.bola3, prognostico.bola4, prognostico.bola5,
        prognostico.bola6, prognostico.bola7, prognostico.bola8, prognostico.bola9, prognostico.bola10,
        prognostico.bola11, prognostico.bola12, prognostico.bola13, prognostico.bola14, prognostico.bola15,
        new Date().toISOString()
      ];

      await pgPool.query(insertQuery, values);
    }
    console.log(`✅ ${samplePrognosticos.length} prognósticos top 100 inseridos`);
    
    console.log('\n🎉 Dados de exemplo inseridos com sucesso no PostgreSQL!');
    
    // Mostrar resumo
    console.log('\n📊 Resumo dos dados inseridos:');
    const tables = ['concursos', 'prog_geral', 'prognosticos_top_10', 'prognosticos_top_20', 'prognosticos_top_50', 'prognosticos_top_100'];
    
    for (const table of tables) {
      const result = await pgPool.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`   ${table}: ${result.rows[0].count} registros`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pgPool.end();
  }
}

insertSampleData(); 