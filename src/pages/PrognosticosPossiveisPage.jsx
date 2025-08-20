import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePrognosticos } from '@/hooks/usePrognosticos';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, ListChecks, CalendarClock, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PrognosticosPossiveisPage = () => {
  const { count } = useParams();
  const prognosticosCount = parseInt(count, 10) || 10;

  // Mapear o count para o tipo correto da tabela
  const getTipoFromCount = (count) => {
    if (count <= 10) return 'top_10';
    if (count <= 20) return 'top_20';
    if (count <= 30) return 'top_30';
    if (count <= 50) return 'top_50';
    return 'top_100';
  };

  const tipo = getTipoFromCount(prognosticosCount);
  const { prognosticos, loading, fetchPrognosticos } = usePrognosticos(tipo);

  useEffect(() => {
    fetchPrognosticos();
  }, [tipo, fetchPrognosticos]);

  const renderBolas = (prognostico) => {
    if (!prognostico) return null;
    return Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
      <div
        key={num}
        className="lottery-ball"
      >
        {prognostico[`bola${num}`]}
      </div>
    ));
  };

  const handleGenerateCombinations = async () => {
    toast({
      title: "Funcionalidade em Desenvolvimento",
      description: "A geração automática de prognósticos será implementada em breve.",
      variant: "default",
    });
  }

  const handleExportCSV = () => {
    if (prognosticos.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há prognósticos para exportar.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Bola1", "Bola2", "Bola3", "Bola4", "Bola5", "Bola6", "Bola7", "Bola8", "Bola9", "Bola10", "Bola11", "Bola12", "Bola13", "Bola14", "Bola15", "GeradoEm"];
    
    const csvRows = [
      headers.join(';') 
    ];

    prognosticos.forEach(prognostico => {
      const row = [
        prognostico.bola1, prognostico.bola2, prognostico.bola3, prognostico.bola4, prognostico.bola5,
        prognostico.bola6, prognostico.bola7, prognostico.bola8, prognostico.bola9, prognostico.bola10,
        prognostico.bola11, prognostico.bola12, prognostico.bola13, prognostico.bola14, prognostico.bola15,
        new Date(prognostico.gerado_em).toLocaleString('pt-BR')
      ];
      csvRows.push(row.join(';'));
    });

    const csvString = "\uFEFF" + csvRows.join('\n'); 
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `prognosticos_top${prognosticosCount}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportação realizada",
      description: "Arquivo CSV baixado com sucesso!",
      variant: "default",
    });
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
          <ListChecks className="w-12 h-12 text-caixa-laranja" />
          <h1 className="text-5xl font-extrabold text-caixa-azul">
            Prognósticos - TOP {prognosticosCount}
          </h1>
        </div>
        <p className="text-caixa-cinzaEscuro text-xl">
          Exibindo as combinações geradas para TOP {prognosticosCount}.
        </p>
      </motion.header>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center p-6 bg-caixa-branco rounded-lg shadow-md border border-caixa-cinzaMedio gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Button
              onClick={handleGenerateCombinations}
              disabled={loading}
              className="btn-caixa-primary font-semibold transform transition-all duration-200 hover:scale-105 shadow-md flex-grow"
              size="lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Carregando...' : 'Atualizar Prognósticos'}
            </Button>
            <Button
              onClick={handleExportCSV}
              disabled={loading || prognosticos.length === 0}
              className="btn-caixa-secondary font-semibold transform transition-all duration-200 hover:scale-105 shadow-md flex-grow"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Exportar Prognósticos
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 text-center">
            <Loader2 className="w-16 h-16 text-caixa-azul animate-spin mb-6" />
            <p className="text-2xl text-caixa-azulEscuro font-semibold">
              Carregando prognósticos...
            </p>
            <p className="text-caixa-cinzaEscuro">
              Buscando as combinações mais recentes.
            </p>
          </div>
        ) : prognosticos.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="p-10 max-w-lg mx-auto bg-caixa-branco border border-caixa-cinzaMedio rounded-lg shadow-md">
              <CalendarClock className="w-20 h-20 text-caixa-cinzaMedio mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-caixa-azulEscuro mb-3">
                Nenhum Prognóstico Encontrado
              </h3>
              <p className="text-caixa-cinzaEscuro text-lg">
                Não há prognósticos cadastrados para TOP {prognosticosCount}.
              </p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              className="grid gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {prognosticos.map((prognostico) => (
                <motion.div
                  key={prognostico.id}
                  className="p-6 bg-caixa-branco rounded-lg shadow-md border border-caixa-cinzaMedio"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-wrap gap-4 justify-center">
                    {renderBolas(prognostico)}
                  </div>
                   <p className="text-xs text-caixa-cinza text-right mt-2">
                    Gerado em: {new Date(prognostico.gerado_em).toLocaleString('pt-BR')}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
};

export default PrognosticosPossiveisPage;