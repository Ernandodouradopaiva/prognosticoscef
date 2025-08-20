import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { LogIn, BarChart3 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: "Login bem-sucedido!",
        description: "Bem-vindo de volta!",
        variant: "success",
      });
      navigate('/'); 
    } catch (error) {
      let description = error.message || "Verifique suas credenciais e tente novamente.";
      if (error.message && error.message.toLowerCase().includes("email not confirmed")) {
        description = "Seu e-mail ainda não foi confirmado. Por favor, verifique sua caixa de entrada (e spam) e clique no link de confirmação. Seu acesso também depende de aprovação.";
      } else if (error.status_code) { // Custom error from AuthContext
         description = `Seu acesso está ${error.status_code}. Por favor, aguarde a liberação ou contate o administrador.`;
      }
      
      toast({
        title: "Erro no Login",
        description: description,
        variant: "destructive",
        duration: 7000,
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-caixa-azul via-caixa-azul-escuro to-caixa-azul-claro p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl glass-card">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <BarChart3 className="h-12 w-12 text-caixa-laranja" />
            </div>
            <CardTitle className="text-3xl font-bold text-caixa-azul">Bem-vindo!</CardTitle>
            <CardDescription className="text-caixa-cinzaEscuro">
              Acesse sua conta para continuar. Lembre-se que o acesso requer aprovação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-caixa-texto">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-caixa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-caixa-texto">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-caixa"
                />
              </div>
              <Button type="submit" className="w-full btn-caixa-primary font-semibold" disabled={loading}>
                {loading ? 'Entrando...' : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Entrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-caixa-cinzaEscuro">
              Não tem uma conta?{' '}
              <Link to="/signup" className="font-medium text-caixa-laranja hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;