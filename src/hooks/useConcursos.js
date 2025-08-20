import { useState, useEffect, useCallback } from 'react';
import { postgresClient } from '@/lib/postgresClient';
import { toast } from '@/components/ui/use-toast';

export const useConcursos = () => {
  const [concursos, setConcursos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConcursos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await postgresClient.getConcursos();
      setConcursos(data || []);
    } catch (error) {
      console.error('Erro ao buscar concursos:', error);
      toast({ title: "Erro", description: `Falha ao carregar concursos: ${error.message}`, variant: "destructive" });
      setConcursos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConcursos();
  }, [fetchConcursos]);

  const addConcurso = async (concursoData) => {
    setLoading(true);
    const dataToInsert = { ...concursoData };
    for (let i = 1; i <= 15; i++) {
      const key = `bola${i}`;
      if (dataToInsert[key] === '' || dataToInsert[key] === undefined || dataToInsert[key] === null) {
        dataToInsert[key] = null;
      } else {
        const parsedNum = parseInt(dataToInsert[key], 10);
        dataToInsert[key] = isNaN(parsedNum) ? null : parsedNum;
      }
    }
    delete dataToInsert.id; 

    try {
      await postgresClient.createConcurso(dataToInsert);
      fetchConcursos(); 
      toast({ title: "Sucesso!", description: "Concurso adicionado com sucesso!" });
    } catch (error) {
      console.error('Erro ao adicionar concurso:', error);
      toast({ title: "Erro", description: `Falha ao salvar concurso: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  const bulkAddConcursos = async (concursosData) => {
    setLoading(true);
    const dataToInsert = concursosData.map(c => {
      const concurso = { ...c };
      for (let i = 1; i <= 15; i++) {
        const key = `bola${i}`;
        if (concurso[key] === '' || concurso[key] === undefined || concurso[key] === null) {
          concurso[key] = null;
        } else {
          const parsedNum = parseInt(concurso[key], 10);
          concurso[key] = isNaN(parsedNum) ? null : parsedNum;
        }
      }
      delete concurso.id;
      return concurso;
    });

    try {
      // Inserir concursos um por um
      for (const concurso of dataToInsert) {
        await postgresClient.createConcurso(concurso);
      }
      
      fetchConcursos(); 
      toast({ title: "Sucesso!", description: `${concursosData.length} concursos importados com sucesso!` });
    } catch (error) {
      console.error('Erro ao adicionar concursos em lote:', error);
      toast({ title: "Erro", description: `Falha ao importar concursos: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateConcurso = async (updatedConcursoData) => {
    setLoading(true);
    const dataToUpdate = { ...updatedConcursoData };
    for (let i = 1; i <= 15; i++) {
      const key = `bola${i}`;
      if (dataToUpdate[key] === '' || dataToUpdate[key] === undefined || dataToUpdate[key] === null) {
        dataToUpdate[key] = null;
      } else {
         const parsedNum = parseInt(dataToUpdate[key], 10);
         dataToUpdate[key] = isNaN(parsedNum) ? null : parsedNum;
      }
    }
    const { id, ...fieldsToUpdate } = dataToUpdate;

    try {
      await postgresClient.updateConcurso(id, fieldsToUpdate);
      fetchConcursos(); 
      toast({ title: "Sucesso!", description: "Concurso atualizado com sucesso!" });
    } catch (error) {
      console.error('Erro ao atualizar concurso:', error);
      toast({ title: "Erro", description: `Falha ao atualizar concurso: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteConcurso = async (id) => {
    setLoading(true);
    try {
      await postgresClient.deleteConcurso(id);
      fetchConcursos();
      toast({ title: "Sucesso!", description: "Concurso excluído com sucesso!" });
    } catch (error) {
      console.error('Erro ao deletar concurso:', error);
      toast({ title: "Erro", description: `Falha ao excluir concurso: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return {
    concursos,
    loading,
    fetchConcursos,
    addConcurso,
    updateConcurso,
    deleteConcurso,
    bulkAddConcursos
  };
};