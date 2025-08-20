import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, Home, Calculator, ListChecks, LogOut, FilePlus, Users } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Layout = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Até logo!",
        variant: "success"
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: error.message || "Não foi possível fazer logout.",
        variant: "destructive"
      });
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-caixa-azul/10 hover:text-caixa-azul-escuro ${
      isActive ? 'bg-caixa-azul/20 text-caixa-azul-escuro font-semibold' : 'text-caixa-texto'
    }`;

  const prognosticosSubMenu = [
    { to: "/prognosticos/10", label: "Prognósticos - TOP 10", count: 10 },
    { to: "/prognosticos/20", label: "Prognósticos - TOP 20", count: 20 },
    { to: "/prognosticos/30", label: "Prognósticos - TOP 30", count: 30 },
    { to: "/prognosticos/50", label: "Prognósticos - TOP 50", count: 50 },
    { to: "/prognosticos/100", label: "Prognósticos - TOP 100", count: 100 },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-caixa-cinzaMedio bg-caixa-branco md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center justify-between border-b border-caixa-cinzaMedio px-4 lg:h-[60px] lg:px-6">
            <NavLink to="/" className="flex items-center gap-2 font-semibold text-caixa-azul">
              <BarChart3 className="h-6 w-6 text-caixa-laranja" />
              <span>Análises CEF</span>
            </NavLink>
          </div>
          <nav className="flex-1 overflow-auto py-4 px-2 text-sm font-medium lg:px-4">
            <NavLink to="/registro-resultados" className={navLinkClasses}>
              <Home className="h-4 w-4" />
              Registro de Resultados
            </NavLink>
            {isAdmin && (
              <>
                <NavLink to="/cadastro-prognosticos" className={navLinkClasses}>
                  <FilePlus className="h-4 w-4" />
                  Cadastro de Prognósticos
                </NavLink>
                <NavLink to="/prognosticos-possiveis" className={navLinkClasses}>
                  <Calculator className="h-4 w-4" />
                  Prognósticos possíveis
                </NavLink>
              </>
            )}
            <div className="mt-2">
              <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-caixa-texto font-semibold">
                <ListChecks className="h-4 w-4" />
                Prognósticos
              </span>
              <div className="ml-4 mt-1 border-l border-caixa-cinza pl-4">
                {prognosticosSubMenu.map(item => (
                  <NavLink 
                    key={item.to}
                    to={item.to} 
                    className={({ isActive }) => 
                      `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm hover:bg-caixa-azul/10 hover:text-caixa-azul-escuro ${
                        isActive ? 'bg-caixa-azul/20 text-caixa-azul-escuro font-semibold' : 'text-caixa-texto'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
            {isAdmin && (
              <NavLink to="/user-management" className={navLinkClasses}>
                <Users className="h-4 w-4" />
                Liberação de Usuários
              </NavLink>
            )}
          </nav>
          {user && (
            <div className="mt-auto p-4 border-t border-caixa-cinzaMedio">
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full btn-caixa-outline"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </aside>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-caixa-cinza overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;