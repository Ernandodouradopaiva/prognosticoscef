import { createClient } from '@supabase/supabase-js';

// Configuração Supabase
const supabaseUrl = 'https://nmvjayskvfunvcxsetel.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tdmpheXNrdmZ1bnZjeHNldGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTYzNTIsImV4cCI6MjA2NDI5MjM1Mn0.EZxGLgg2scfdMJort_CT_Q8mTL-wSlRecIugKPTV0KU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSupabaseData() {
  try {
    console.log('🔍 Verificando dados no Supabase...\n');
    
    const tables = [
      'concursos',
      'prog_geral', 
      'prognosticos_top_10',
      'prognosticos_top_20',
      'prognosticos_top_50',
      'prognosticos_top_100'
    ];
    
    for (const table of tables) {
      console.log(`📊 Verificando tabela: ${table}`);
      
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(5);
      
      if (error) {
        console.log(`   ❌ Erro: ${error.message}`);
        continue;
      }
      
      console.log(`   📥 Total de registros: ${count || 0}`);
      
      if (data && data.length > 0) {
        console.log(`   📋 Primeiros registros:`);
        data.slice(0, 2).forEach((record, index) => {
          console.log(`      ${index + 1}. ${JSON.stringify(record, null, 2)}`);
        });
      } else {
        console.log(`   ℹ️ Tabela vazia`);
      }
      
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkSupabaseData(); 