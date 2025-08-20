import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import RegistroResultadosPage from '@/pages/RegistroResultadosPage';
import PrognosticosPossiveisPage from '@/pages/PrognosticosPossiveisPage';
import PrognosticosGeraisPage from '@/pages/PrognosticosGeraisPage';
import CadastroPrognosticosPage from '@/pages/CadastroPrognosticosPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import UserManagementPage from '@/pages/UserManagementPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/registro-resultados" replace />} />
            <Route path="registro-resultados" element={<RegistroResultadosPage />} />
            
            <Route path="prognosticos/:count" element={<PrognosticosPossiveisPage />} />
            
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="cadastro-prognosticos" element={<CadastroPrognosticosPage />} />
              <Route path="prognosticos-possiveis" element={<PrognosticosGeraisPage />} />
              <Route path="user-management" element={<UserManagementPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/registro-resultados" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} /> 
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;