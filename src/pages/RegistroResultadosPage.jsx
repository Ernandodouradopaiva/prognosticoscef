import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ConcursoForm from '@/components/ConcursoForm';
import ConcursoCard from '@/components/ConcursoCard';
import { useConcursos } from '@/hooks/useConcursos';
import { Plus, Award, Upload, Loader2, Download, Search, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 12;

const RegistroResultadosPage = () => {
  const { concursos, addConcurso, updateConcurso, deleteConcurso, bulkAddConcursos, loading } = useConcursos();
  const [showForm, setShowForm] = useState(false);
  const [editingConcurso, setEditingConcurso] = useState(null);
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSave = async (concursoData) => {
    if (editingConcurso) {
      await updateConcurso({ ...concursoData, id: editingConcurso.id });
    } else {
      await addConcurso(concursoData);
    }
    setShowForm(false);
    setEditingConcurso(null);
    setCurrentPage(1); 
  };

  const handleEdit = (concurso) => {
    const concursoWithAllBalls = { ...concurso };
    for (let i = 1; i <= 15; i++) {
      if (concursoWithAllBalls[`bola${i}`] === null || concursoWithAllBalls[`bola${i}`] === undefined) {
        concursoWithAllBalls[`bola${i}`] = '';
      }
    }
    setEditingConcurso(concursoWithAllBalls);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este concurso?')) {
      await deleteConcurso(id);
      setCurrentPage(1);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingConcurso(null);
  };

  const handleNewConcurso = () => {
    setEditingConcurso(null); 
    setShowForm(true);
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleDownloadTemplate = () => {
    const headers = ["Concurso", "Data"];
    for (let i = 1; i <= 15; i++) {
      headers.push(`bola${i}`);
    }
    const exampleRow = ["EX2024001", "2024-01-15", "1", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "58", "59", "60"];
    
    const ws_data = [headers, exampleRow];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ModeloConcursos");
    XLSX.writeFile(wb, "modelo_importacao_concursos.xlsx");
    toast({ title: "Download Iniciado", description: "O modelo da planilha está sendo baixado." });
  };

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array', cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
             toast({ title: "Erro na Importação", description: "Planilha vazia ou sem cabeçalho.", variant: "destructive" });
             return;
          }

          const headers = jsonData[0].map(h => h.toString().trim().toLowerCase());
          const normalizedHeaders = headers.map(h => h.replace(/\s+/g, '')); 

          const requiredHeaders = ['concurso', 'data'];
          const missingRequired = requiredHeaders.filter(rh => !normalizedHeaders.includes(rh));

          if (missingRequired.length > 0) {
             toast({ title: "Erro na Importação", description: `Cabeçalhos obrigatórios ausentes: ${missingRequired.join(', ')}.`, variant: "destructive" });
             return;
          }

          const importedConcursos = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            const concursoData = {};
            
            headers.forEach((header, index) => {
              const normalizedHeader = header.replace(/\s+/g, ''); 
              let value = row[index];

              if (normalizedHeader === 'concurso') concursoData.concurso = value ? String(value) : '';
              else if (normalizedHeader === 'data') {
                if (value instanceof Date) {
                  const year = value.getFullYear();
                  const month = (value.getMonth() + 1).toString().padStart(2, '0');
                  const day = value.getDate().toString().padStart(2, '0');
                  concursoData.data = `${year}-${month}-${day}`;
                } else if (typeof value === 'number' && value > 20000 && value < 60000) { 
                    const date = XLSX.SSF.parse_date_code(value);
                    concursoData.data = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
                } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
                   concursoData.data = value.split(' ')[0]; 
                } else if (typeof value === 'string' && /^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(value)) {
                    const parts = value.split(' ')[0].split('/');
                    const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
                    concursoData.data = `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                } else {
                   concursoData.data = ''; 
                }
              }
              else if (normalizedHeader.startsWith('bola')) {
                const ballKey = `bola${normalizedHeader.replace('bola', '')}`;
                concursoData[ballKey] = value !== undefined && value !== null && value !== '' ? String(parseInt(value,10)) : '';
              }
            });
            
            if (!concursoData.concurso || !concursoData.data) {
              console.warn(`Linha ${i+1} ignorada: Concurso ou Data ausentes ou inválidos.`);
              continue;
            }
            
            const bolasPreenchidas = Object.keys(concursoData).filter(key => key.startsWith('bola') && concursoData[key] !== '').length > 0;
            if (!bolasPreenchidas) {
              console.warn(`Linha ${i+1} ignorada: Nenhuma bola preenchida.`);
              continue; 
            }
            importedConcursos.push(concursoData);
          }

          if (importedConcursos.length > 0) {
            await bulkAddConcursos(importedConcursos);
            setCurrentPage(1);
          } else {
            toast({ title: "Aviso", description: "Nenhum concurso válido encontrado na planilha para importar.", variant: "default" });
          }

        } catch (error) {
          console.error("Erro ao importar planilha:", error);
          toast({ title: "Erro na Importação", description: "Não foi possível processar a planilha. Verifique o formato e os dados.", variant: "destructive" });
        }
      };
      reader.readAsArrayBuffer(file);
    }
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredConcursos = concursos.filter(concurso => 
    concurso.concurso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredConcursos.length / ITEMS_PER_PAGE);
  const paginatedConcursos = filteredConcursos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredConcursos.length, currentPage, totalPages]);
  

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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
          <BarChart3 className="w-12 h-12 text-caixa-laranja" />
          <h1 className="text-5xl font-extrabold text-caixa-azul">
            Registro de Resultados
          </h1>
        </div>
        <p className="text-caixa-cinzaEscuro text-xl">Confira e gerencie os concursos da Loto Fácil.</p>
      </motion.header>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="mb-8"
          >
            <ConcursoForm
              concurso={editingConcurso}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list-controls"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 p-6 bg-caixa-branco rounded-lg shadow-md border border-caixa-cinzaMedio">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleNewConcurso}
                  disabled={loading}
                  className="w-full sm:w-auto btn-caixa-primary font-semibold transform transition-all duration-200 hover:scale-105 shadow-md"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Novo Concurso
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".xlsx, .xls"
                  className="hidden"
                  disabled={loading}
                />
                <Button
                  onClick={handleImportClick}
                  disabled={loading}
                  className="w-full sm:w-auto btn-caixa-secondary font-semibold transform transition-all duration-200 hover:scale-105 shadow-md"
                  size="lg"
                >
                  {loading && concursos.length === 0 ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Upload className="w-5 h-5 mr-2" />}
                  Importar
                </Button>
                <Button
                  onClick={handleDownloadTemplate}
                  disabled={loading}
                  variant="outline"
                  className="w-full sm:w-auto btn-caixa-outline font-semibold transform transition-all duration-200 hover:scale-105 shadow-sm"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Modelo
                </Button>
              </div>
              <div className="relative w-full sm:w-auto sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-caixa-cinzaEscuro" />
                <Input 
                  type="text"
                  placeholder="Buscar concurso..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); 
                  }}
                  className="pl-10 input-caixa w-full"
                />
              </div>
            </div>
            
            {loading && (
               <div className="flex flex-col justify-center items-center py-20 text-center">
                  <Loader2 className="w-16 h-16 text-caixa-azul animate-spin mb-6" />
                  <p className="text-2xl text-caixa-azulEscuro font-semibold">Carregando concursos...</p>
                  <p className="text-caixa-cinzaEscuro">Buscando os dados mais recentes.</p>
               </div>
            )}

            {!loading && filteredConcursos.length === 0 ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="p-10 max-w-lg mx-auto bg-caixa-branco border border-caixa-cinzaMedio rounded-lg shadow-md">
                  <Award className="w-20 h-20 text-caixa-cinzaMedio mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-caixa-azulEscuro mb-3">
                    {searchTerm ? 'Nenhum concurso encontrado' : 'Nenhum Concurso Cadastrado'}
                  </h3>
                  <p className="text-caixa-cinzaEscuro text-lg">
                    {searchTerm ? `Não encontramos concursos com o termo "${searchTerm}".` : 'Clique em "Novo Concurso" ou importe uma planilha para começar.'}
                  </p>
                </div>
              </motion.div>
            ) : !loading && paginatedConcursos.length > 0 ? (
              <>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, staggerChildren: 0.07, duration: 0.5 }}
                >
                  {paginatedConcursos.map((concurso) => (
                    <motion.div
                      key={concurso.id}
                      layout 
                      initial={{ opacity: 0, y: 25, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -25, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="h-full"
                    >
                      <ConcursoCard
                        concurso={concurso}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {totalPages > 1 && (
                  <motion.div 
                    className="flex justify-center items-center space-x-4 mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <Button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1 || loading}
                      variant="outline"
                      className="btn-caixa-outline"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Anterior
                    </Button>
                    <span className="text-caixa-azulEscuro font-medium">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || loading}
                      variant="outline"
                      className="btn-caixa-outline"
                    >
                      Próxima
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </>
            ) : !loading && filteredConcursos.length > 0 && paginatedConcursos.length === 0 ? (
                 <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                   <div className="p-10 max-w-lg mx-auto bg-caixa-branco border border-caixa-cinzaMedio rounded-lg shadow-md">
                     <Award className="w-20 h-20 text-caixa-cinzaMedio mx-auto mb-6" />
                     <h3 className="text-2xl font-semibold text-caixa-azulEscuro mb-3">Página Inválida</h3>
                     <p className="text-caixa-cinzaEscuro text-lg">
                       Parece que esta página não tem resultados. Tente voltar para a primeira página.
                     </p>
                     <Button onClick={() => setCurrentPage(1)} className="mt-4 btn-caixa-primary">Voltar para Página 1</Button>
                   </div>
                 </motion.div>
            ) : null }
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default RegistroResultadosPage;