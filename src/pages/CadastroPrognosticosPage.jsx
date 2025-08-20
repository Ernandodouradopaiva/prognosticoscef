import React, { useState } from 'react';
import { postgresClient } from '@/lib/postgresClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Upload, Download, ListPlus, Loader2, FileText, File, X } from 'lucide-react';

const CadastroPrognosticosPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const removeFile = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  const downloadModeloCSV = () => {
    const header = ["bola1", "bola2", "bola3", "bola4", "bola5", "bola6", "bola7", "bola8", "bola9", "bola10", "bola11", "bola12", "bola13", "bola14", "bola15"];
    const exampleRow1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const exampleRow2 = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 21, 22, 23, 24, 25];
    
    const csvContent = [
      header.join(';'),
      exampleRow1.join(';'),
      exampleRow2.join(';')
    ].join('\n');

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "modelo_prognosticos.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast({
      title: "Modelo CSV Baixado",
      description: "Preencha o arquivo modelo_prognosticos.csv (separado por ';') e importe.",
      variant: "default"
    });
  };

  const parseCSV = (text) => {
    const rows = text.replace(/\r/g, '').split('\n').filter(row => row.trim() !== '');
    return rows.map(row => row.split(';'));
  };

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileContent = e.target.result;
          const jsonData = parseCSV(fileContent);

          if (jsonData.length <= 1) {
            return reject(new Error(`Arquivo '${file.name}' está vazio ou mal formatado.`));
          }

          const headerFromFile = jsonData[0].map(h => String(h).trim().toLowerCase());
          const expectedHeader = ["bola1", "bola2", "bola3", "bola4", "bola5", "bola6", "bola7", "bola8", "bola9", "bola10", "bola11", "bola12", "bola13", "bola14", "bola15"];
          const isValidHeader = expectedHeader.every(eh => headerFromFile.includes(eh)) && headerFromFile.length === expectedHeader.length;

          if (!isValidHeader) {
            return reject(new Error(`Cabeçalho inválido no arquivo '${file.name}'. Verifique o modelo e o separador (';').`));
          }

          const prognosticos = jsonData.slice(1).map((row, rowIndex) => {
            if (row.length !== expectedHeader.length) {
              throw new Error(`Número incorreto de colunas na linha ${rowIndex + 2} do arquivo '${file.name}'.`);
            }
            const prognostico = {};
            expectedHeader.forEach((col) => {
              const cellIndex = headerFromFile.indexOf(col);
              const cellValue = row[cellIndex];
              const numValue = parseInt(cellValue, 10);
              if (isNaN(numValue) || numValue < 1 || numValue > 25) {
                throw new Error(`Valor inválido na linha ${rowIndex + 2}, coluna '${col}' do arquivo '${file.name}': '${cellValue}'.`);
              }
              prognostico[col] = numValue;
            });
            const uniqueBalls = new Set(Object.values(prognostico));
            if (uniqueBalls.size !== 15) {
              throw new Error(`Combinação inválida na linha ${rowIndex + 2} do arquivo '${file.name}': Deve conter 15 números únicos.`);
            }
            return prognostico;
          });

          resolve(prognosticos);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(new Error(`Erro ao ler o arquivo '${file.name}': ${error}`));
      reader.readAsText(file, 'UTF-8');
    });
  };

  const handleImportCSV = async () => {
    if (files.length === 0) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um ou mais arquivos CSV para importar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const allPrognosticosPromises = files.map(processFile);
      const results = await Promise.all(allPrognosticosPromises);
      const allPrognosticosParaInserir = results.flat();

      if (allPrognosticosParaInserir.length === 0) {
        toast({
          title: "Nenhum dado para importar",
          description: "Os arquivos selecionados não contêm prognósticos válidos.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Iniciando importação",
        description: `Processando ${allPrognosticosParaInserir.length} prognósticos...`,
        variant: "default",
      });

      // Inserir prognósticos usando o novo backend
      const BATCH_SIZE = 100; // Reduzido para evitar timeout
      let insertedCount = 0;
      
      for (let i = 0; i < allPrognosticosParaInserir.length; i += BATCH_SIZE) {
        const batch = allPrognosticosParaInserir.slice(i, i + BATCH_SIZE);
        
        try {
          // Inserir cada prognóstico individualmente para evitar problemas de timeout
          for (const prognostico of batch) {
            await postgresClient.createPrognosticoGeral(prognostico);
            insertedCount++;
          }
          
          toast({
            title: "Progresso da Importação",
            description: `${insertedCount} de ${allPrognosticosParaInserir.length} prognósticos inseridos.`,
            variant: "default",
            duration: 2000,
          });
        } catch (error) {
          throw new Error(`Erro ao inserir lote de prognósticos: ${error.message}`);
        }
      }

      toast({
        title: "Importação Concluída!",
        description: `${insertedCount} prognósticos de ${files.length} arquivo(s) foram importados com sucesso.`,
        variant: "default",
      });

    } catch (error) {
      console.error("Erro na importação:", error);
      toast({
        title: "Erro na Importação",
        description: error.message || "Ocorreu um problema ao processar os arquivos CSV.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setFiles([]);
      if (document.getElementById('csv-file-input')) {
        document.getElementById('csv-file-input').value = '';
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-8"
    >
      <Card className="max-w-2xl mx-auto shadow-2xl glass-card border-caixa-cinzaMedio">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <ListPlus className="h-12 w-12 text-caixa-laranja" />
          </div>
          <CardTitle className="text-3xl font-bold text-caixa-azul">Cadastro de Prognósticos</CardTitle>
          <CardDescription className="text-caixa-cinzaEscuro">
            Importe um ou mais arquivos CSV (separado por ';') ou baixe um modelo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4 p-6 bg-caixa-branco/50 rounded-lg border border-caixa-cinza">
            <h3 className="text-xl font-semibold text-caixa-azulEscuro flex items-center">
              <FileText className="mr-2 h-5 w-5 text-caixa-laranja" />
              Baixar Modelo CSV
            </h3>
            <p className="text-sm text-caixa-texto">
              Baixe um arquivo CSV modelo para preencher com os prognósticos.
              O arquivo deve seguir o padrão UTF-8 BOM, ser separado por ponto e vírgula (;) e ter as colunas: bola1;bola2;...;bola15.
            </p>
            <Button onClick={downloadModeloCSV} className="w-full btn-caixa-secondary font-semibold">
              <Download className="mr-2 h-4 w-4" />
              Baixar Modelo
            </Button>
          </div>

          <div className="space-y-4 p-6 bg-caixa-branco/50 rounded-lg border border-caixa-cinza">
            <h3 className="text-xl font-semibold text-caixa-azulEscuro flex items-center">
              <Upload className="mr-2 h-5 w-5 text-caixa-laranja" />
              Importar Arquivos CSV
            </h3>
            <div className="space-y-2">
              <Label htmlFor="csv-file-input" className="text-caixa-texto">Selecione os arquivos CSV (separado por ';')</Label>
              <Input
                id="csv-file-input"
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                multiple
                className="input-caixa file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-caixa-laranja/20 file:text-caixa-laranja hover:file:bg-caixa-laranja/30"
              />
            </div>
            {files.length > 0 && (
              <div className="space-y-2 pt-4">
                <h4 className="font-semibold text-caixa-texto">Arquivos Selecionados:</h4>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-caixa-cinza/50 p-2 rounded-md text-sm">
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4 text-caixa-azul" />
                        <span className="font-mono">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(file.name)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={handleImportCSV} disabled={loading || files.length === 0} className="w-full btn-caixa-primary font-semibold mt-4">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {loading ? 'Importando...' : `Importar ${files.length} Arquivo(s)`}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-caixa-cinzaEscuro text-center w-full">
            A importação substituirá todos os dados existentes na tabela 'prog_geral'.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CadastroPrognosticosPage;