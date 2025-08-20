import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { UserPlus, BarChart3 } from 'lucide-react';

const SignUpPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Erro de Cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, nome);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Sua conta foi criada e está pendente de aprovação. Você também receberá um e-mail para confirmar seu endereço.",
        variant: "success",
        duration: 7000,
      });
      navigate('/login'); 
    } catch (error) {
      toast({
        title: "Erro no Cadastro",
        description: error.message || "Não foi possível criar sua conta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-caixa-laranja via-caixa-laranja-escuro to-caixa-azul-claro p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl glass-card">
          <CardHeader className="text-center">
             <div className="flex justify-center items-center mb-4">
              <BarChart3 className="h-12 w-12 text-caixa-azul" />
            </div>
            <CardTitle className="text-3xl font-bold text-caixa-laranja">Crie sua Conta</CardTitle>
            <CardDescription className="text-caixa-cinzaEscuro">
              Junte-se a nós para análises incríveis! Seu acesso será liberado após aprovação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-caixa-texto">Nome Completo</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="input-caixa"
                />
              </div>
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
                  placeholder="Crie uma senha forte"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-caixa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-caixa-texto">Confirmar Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input-caixa"
                />
              </div>
              <Button type="submit" className="w-full btn-caixa-secondary font-semibold" disabled={loading}>
                {loading ? 'Criando conta...' : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" /> Cadastrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-caixa-cinzaEscuro">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-caixa-azul hover:underline">
                Faça Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpPage;