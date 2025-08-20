import { useState, useEffect, useCallback } from 'react';
import { postgresClient } from '@/lib/postgresClient';
import { toast } from '@/components/ui/use-toast';

export const usePrognosticos = (tipo) => {
  const [prognosticos, setPrognosticos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrognosticos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await postgresClient.getPrognosticos(tipo);
      setPrognosticos(data || []);
    } catch (error) {
      console.error('Erro ao buscar prognósticos:', error);
      toast({ title: "Erro", description: `Falha ao carregar prognósticos: ${error.message}`, variant: "destructive" });
      setPrognosticos([]);
    } finally {
      setLoading(false);
    }
  }, [tipo]);

  useEffect(() => {
    fetchPrognosticos();
  }, [fetchPrognosticos]);

  return {
    prognosticos,
    loading,
    fetchPrognosticos
  };
};