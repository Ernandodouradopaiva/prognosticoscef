import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChevronLeft, ChevronRight, Calculator } from 'lucide-react';
import { usePrognosticosGerais } from '@/hooks/usePrognosticosGerais';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PrognosticosGeraisPage = () => {
  const {
    prognosticos,
    loading,
    totalPages,
    currentPage,
    setCurrentPage,
  } = usePrognosticosGerais(10); 

  const renderBolas = (prognostico) => {
    if (!prognostico) return null;
    return Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
      <div
        key={num}
        className="lottery-ball-sm"
      >
        {prognostico[`bola${num}`]}
      </div>
    ));
  };
  
  return (
    <>
      <motion.header
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <Calculator className="w-12 h-12 text-caixa-laranja" />
          <h1 className="text-5xl font-extrabold text-caixa-azul">
            Prognósticos Possíveis
          </h1>
        </div>
        <p className="text-caixa-cinzaEscuro text-xl">
          Visualização de todas as combinações de prognósticos cadastradas no sistema.
        </p>
      </motion.header>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Lista de Prognósticos Gerais</CardTitle>
            <CardDescription>
                Navegue pela lista completa de prognósticos. São exibidos 10 por página.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-16 h-16 text-caixa-azul animate-spin" />
                </div>
            ) : prognosticos.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-caixa-cinzaEscuro">Nenhum prognóstico encontrado.</p>
                </div>
            ) : (
                <>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Data de Criação</TableHead>
                                    <TableHead>Combinação de 15 Números</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prognosticos.map((prognostico) => (
                                    <TableRow key={prognostico.id}>
                                        <TableCell className="font-medium">
                                            {new Date(prognostico.created_at).toLocaleString('pt-BR')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                                {renderBolas(prognostico)}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-end gap-4 mt-6">
                            <Button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                                variant="outline"
                                className="btn-caixa-outline"
                            >
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                Anterior
                            </Button>
                            <span className="text-caixa-texto font-medium">
                                Página {currentPage} de {totalPages}
                            </span>
                            <Button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages || loading}
                                variant="outline"
                                className="btn-caixa-outline"
                            >
                                Próxima
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </CardContent>
      </Card>
    </>
  );
};

export default PrognosticosGeraisPage;