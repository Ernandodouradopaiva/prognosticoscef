import { createClient } from '@supabase/supabase-js';

// Configuração Supabase
const supabaseUrl = 'https://nmvjayskvfunvcxsetel.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tdmpheXNrdmZ1bnZjeHNldGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTYzNTIsImV4cCI6MjA2NDI5MjM1Mn0.EZxGLgg2scfdMJort_CT_Q8mTL-wSlRecIugKPTV0KU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    console.log('🚀 Inserindo dados de exemplo no Supabase...\n');
    
    // Inserir concursos
    console.log('📊 Inserindo concursos...');
    const { data: concursosData, error: concursosError } = await supabase
      .from('concursos')
      .insert(sampleConcursos)
      .select();
    
    if (concursosError) {
      console.error('❌ Erro ao inserir concursos:', concursosError);
    } else {
      console.log(`✅ ${concursosData.length} concursos inseridos`);
    }
    
    // Inserir prognósticos gerais
    console.log('\n📊 Inserindo prognósticos gerais...');
    const { data: progGeralData, error: progGeralError } = await supabase
      .from('prog_geral')
      .insert(samplePrognosticos)
      .select();
    
    if (progGeralError) {
      console.error('❌ Erro ao inserir prognósticos gerais:', progGeralError);
    } else {
      console.log(`✅ ${progGeralData.length} prognósticos gerais inseridos`);
    }
    
    // Inserir prognósticos top 10
    console.log('\n📊 Inserindo prognósticos top 10...');
    const prognosticosTop10 = samplePrognosticos.map(p => ({
      ...p,
      gerado_em: new Date().toISOString()
    }));
    
    const { data: top10Data, error: top10Error } = await supabase
      .from('prognosticos_top_10')
      .insert(prognosticosTop10)
      .select();
    
    if (top10Error) {
      console.error('❌ Erro ao inserir prognósticos top 10:', top10Error);
    } else {
      console.log(`✅ ${top10Data.length} prognósticos top 10 inseridos`);
    }
    
    // Inserir prognósticos top 20
    console.log('\n📊 Inserindo prognósticos top 20...');
    const prognosticosTop20 = samplePrognosticos.map(p => ({
      ...p,
      gerado_em: new Date().toISOString()
    }));
    
    const { data: top20Data, error: top20Error } = await supabase
      .from('prognosticos_top_20')
      .insert(prognosticosTop20)
      .select();
    
    if (top20Error) {
      console.error('❌ Erro ao inserir prognósticos top 20:', top20Error);
    } else {
      console.log(`✅ ${top20Data.length} prognósticos top 20 inseridos`);
    }
    
    // Inserir prognósticos top 50
    console.log('\n📊 Inserindo prognósticos top 50...');
    const prognosticosTop50 = samplePrognosticos.map(p => ({
      ...p,
      gerado_em: new Date().toISOString()
    }));
    
    const { data: top50Data, error: top50Error } = await supabase
      .from('prognosticos_top_50')
      .insert(prognosticosTop50)
      .select();
    
    if (top50Error) {
      console.error('❌ Erro ao inserir prognósticos top 50:', top50Error);
    } else {
      console.log(`✅ ${top50Data.length} prognósticos top 50 inseridos`);
    }
    
    // Inserir prognósticos top 100
    console.log('\n📊 Inserindo prognósticos top 100...');
    const prognosticosTop100 = samplePrognosticos.map(p => ({
      ...p,
      gerado_em: new Date().toISOString()
    }));
    
    const { data: top100Data, error: top100Error } = await supabase
      .from('prognosticos_top_100')
      .insert(prognosticosTop100)
      .select();
    
    if (top100Error) {
      console.error('❌ Erro ao inserir prognósticos top 100:', top100Error);
    } else {
      console.log(`✅ ${top100Data.length} prognósticos top 100 inseridos`);
    }
    
    console.log('\n🎉 Dados de exemplo inseridos com sucesso!');
    console.log('📋 Próximo passo: executar a migração para PostgreSQL');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

insertSampleData(); 