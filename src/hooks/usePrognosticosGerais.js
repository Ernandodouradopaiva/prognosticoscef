import { useState, useEffect, useCallback } from 'react';
import { postgresClient } from '@/lib/postgresClient';
import { toast } from '@/components/ui/use-toast';

export const usePrognosticosGerais = () => {
  const [prognosticos, setPrognosticos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrognosticos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await postgresClient.getProgGeral();
      setPrognosticos(data || []);
    } catch (error) {
      console.error('Erro ao buscar prognósticos gerais:', error);
      toast({ title: "Erro", description: `Falha ao carregar prognósticos gerais: ${error.message}`, variant: "destructive" });
      setPrognosticos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrognosticos();
  }, [fetchPrognosticos]);

  return {
    prognosticos,
    loading,
    fetchPrognosticos
  };
};