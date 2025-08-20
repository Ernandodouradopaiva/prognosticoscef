import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Users, ShieldCheck, ShieldAlert, ShieldX, UserCheck, UserX, UserCog } from 'lucide-react';
import { motion } from 'framer-motion';

const UserManagementPage = () => {
  const { getAllUsersByAdmin, updateUserStatusByAdmin, user: adminUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const { toast } = useToast();

  const USER_STATUSES = ['Liberado', 'Pendente', 'Suspenso', 'Adm', 'Banido'];
  const ADMIN_EMAIL = 'ernandodourado7@gmail.com';

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getAllUsersByAdmin();
      setUsers(fetchedUsers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message || "Não foi possível buscar a lista de usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [getAllUsersByAdmin, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (userId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [userId]: true }));
    try {
      await updateUserStatusByAdmin(userId, newStatus);
      toast({
        title: "Status atualizado!",
        description: `O status do usuário foi alterado para ${newStatus}.`,
        variant: "success",
      });
      fetchUsers(); 
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Não foi possível alterar o status do usuário.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Liberado': return <UserCheck className="h-5 w-5 text-green-500 mr-2" />;
      case 'Pendente': return <ShieldAlert className="h-5 w-5 text-yellow-500 mr-2" />;
      case 'Suspenso': return <UserX className="h-5 w-5 text-orange-500 mr-2" />;
      case 'Adm': return <UserCog className="h-5 w-5 text-blue-500 mr-2" />;
      case 'Banido': return <ShieldX className="h-5 w-5 text-red-500 mr-2" />;
      default: return <Users className="h-5 w-5 text-gray-400 mr-2" />;
    }
  };
  
  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 text-caixa-azul animate-spin mb-4" />
        <p className="text-xl text-caixa-texto">Carregando usuários...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto py-8 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center bg-caixa-azul-claro p-3 rounded-full mb-4">
          <ShieldCheck className="w-12 h-12 text-caixa-azul-escuro" />
        </div>
        <h1 className="text-4xl font-extrabold text-caixa-azul-escuro tracking-tight">
          Gerenciamento de Usuários
        </h1>
        <p className="mt-2 text-lg text-caixa-cinzaEscuro">
          Visualize e gerencie o status dos usuários do sistema.
        </p>
      </header>

      {users.length === 0 && !loading ? (
        <div className="text-center py-10 bg-caixa-branco rounded-lg shadow-md">
          <Users className="h-20 w-20 text-caixa-cinzaMedio mx-auto mb-4" />
          <p className="text-xl text-caixa-texto">Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <div className="bg-caixa-branco shadow-xl rounded-lg overflow-hidden border border-caixa-cinzaMedio">
          <Table>
            <TableHeader className="bg-caixa-cinzaClaro">
              <TableRow>
                <TableHead className="font-semibold text-caixa-azul-escuro">Email</TableHead>
                <TableHead className="font-semibold text-caixa-azul-escuro">Status Atual</TableHead>
                <TableHead className="font-semibold text-caixa-azul-escuro text-center">Alterar Status</TableHead>
                <TableHead className="font-semibold text-caixa-azul-escuro">Cadastrado em</TableHead>
                <TableHead className="font-semibold text-caixa-azul-escuro">Último Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-caixa-azul/5 transition-colors">
                  <TableCell className="font-medium text-caixa-texto">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(user.status)}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        user.status === 'Liberado' ? 'bg-green-100 text-green-700' :
                        user.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' :
                        user.status === 'Suspenso' ? 'bg-orange-100 text-orange-700' :
                        user.status === 'Adm' ? 'bg-blue-100 text-blue-700' :
                        user.status === 'Banido' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.email === ADMIN_EMAIL ? (
                      <span className="text-sm text-caixa-cinza italic">Admin (Não editável)</span>
                    ) : (
                      <Select
                        value={user.status}
                        onValueChange={(newStatus) => handleStatusChange(user.id, newStatus)}
                        disabled={updatingStatus[user.id]}
                      >
                        <SelectTrigger className="w-[180px] h-9 text-sm focus:ring-caixa-laranja">
                          <SelectValue placeholder="Selecione status" />
                        </SelectTrigger>
                        <SelectContent>
                          {USER_STATUSES.map(status => (
                            <SelectItem key={status} value={status} className="text-sm">
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-caixa-cinzaEscuro">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm text-caixa-cinzaEscuro">
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : 'Nunca'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
};

export default UserManagementPage;