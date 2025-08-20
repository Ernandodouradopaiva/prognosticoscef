import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, userStatus, loading, isAdmin } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-caixa-cinza">
        <Loader2 className="h-16 w-16 text-caixa-azul animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar se o usuário tem acesso (Admin ou Pendente)
  if (userStatus !== 'Admin' && userStatus !== 'Pendente') {
    if (location.pathname !== '/login') { 
      toast({
        title: "Acesso Restrito",
        description: `Seu status é "${userStatus}". Aguarde aprovação ou contate o administrador.`,
        variant: "destructive",
        duration: 7000,
      });
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
     toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      });
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;