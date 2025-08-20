import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nmvjayskvfunvcxsetel.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tdmpheXNrdmZ1bnZjeHNldGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTYzNTIsImV4cCI6MjA2NDI5MjM1Mn0.EZxGLgg2scfdMJort_CT_Q8mTL-wSlRecIugKPTV0KU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);