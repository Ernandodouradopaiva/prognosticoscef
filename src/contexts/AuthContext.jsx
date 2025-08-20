import React, { createContext, useState, useEffect, useContext } from 'react';
import { postgresClient } from '@/lib/postgresClient';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se há token salvo no localStorage
  useEffect(() => {
    const token = localStorage.getItem('postgres_token');
    if (token) {
      // Decodificar o token JWT para obter informações do usuário
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentUser = {
          id: payload.id,
          email: payload.email,
          role: payload.role
        };
        
        setUser(currentUser);
        setUserStatus(currentUser.role);
        
        // Verificar se o usuário tem acesso
        if (currentUser.role === 'Admin' || currentUser.role === 'Pendente') {
          if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
            navigate('/');
          }
        } else {
          toast({
            title: "Acesso Restrito",
            description: "Seu status não permite acesso. Contate o administrador.",
            variant: "destructive",
            duration: 7000,
          });
          signOut();
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        postgresClient.clearToken();
      }
    }
    setLoading(false);
  }, [navigate, toast]);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const data = await postgresClient.signIn(email, password);
      
      setUser(data.user);
      setUserStatus(data.user.role);
      
      // Verificar se o usuário tem acesso
      if (data.user.role === 'Admin' || data.user.role === 'Pendente') {
        navigate('/');
      } else {
        toast({
          title: "Acesso Restrito",
          description: "Seu status não permite acesso. Contate o administrador.",
          variant: "destructive",
          duration: 7000,
        });
        await signOut();
      }
      
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, nome) => {
    setLoading(true);
    try {
      const data = await postgresClient.signUp(email, password, nome);
      
      setUser(data.user);
      setUserStatus(data.user.role);
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Aguarde aprovação do administrador para acessar o sistema.",
        duration: 5000,
      });
      
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      postgresClient.signOut();
      setUser(null);
      setUserStatus(null);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatusByAdmin = async (userId, newStatus) => {
    if (user?.role !== 'Admin') {
      throw new Error("Apenas administradores podem alterar status de usuários.");
    }
    
    try {
      const data = await postgresClient.updateUserStatus(userId, newStatus);
      return data;
    } catch (error) {
      console.error("Erro ao atualizar status do usuário:", error);
      throw error;
    }
  };

  const getAllUsersByAdmin = async () => {
    if (user?.role !== 'Admin') {
      throw new Error("Apenas administradores podem listar usuários.");
    }
    
    try {
      const data = await postgresClient.getUsers();
      return data;
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }
  };

  const value = {
    user,
    userStatus,
    signIn,
    signUp,
    signOut,
    loading,
    isAdmin: user?.role === 'Admin',
    updateUserStatusByAdmin,
    getAllUsersByAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};