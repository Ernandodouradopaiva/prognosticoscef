import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const ConcursoForm = ({ concurso, onSave, onCancel }) => {
  const initialFormData = {
    concurso: '', data: '',
    bola1: '', bola2: '', bola3: '', bola4: '', bola5: '',
    bola6: '', bola7: '', bola8: '', bola9: '', bola10: '',
    bola11: '', bola12: '', bola13: '', bola14: '', bola15: ''
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (concurso) {
      const dataFormatada = concurso.data ? concurso.data.split('T')[0] : ''; // Ajuste para formato YYYY-MM-DD
      setFormData({...initialFormData, ...concurso, data: dataFormatada});
    } else {
      setFormData(initialFormData);
    }
  }, [concurso]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('bola')) {
      const numValue = parseInt(value);
      if (value !== '' && (isNaN(numValue) || numValue < 1 || numValue > 60)) {
        toast({ title: "Valor Inválido", description: "Bolas devem ser números entre 1 e 60.", variant: "destructive", duration: 2000 });
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.concurso || !formData.data) {
      toast({ title: "Campos Obrigatórios", description: "Concurso e Data são obrigatórios!", variant: "destructive" });
      return;
    }

    const bolasPreenchidas = Object.keys(formData)
      .filter(key => key.startsWith('bola'))
      .map(key => formData[key])
      .filter(value => value !== '' && value !== null && value !== undefined);
    
    if (bolasPreenchidas.length === 0) {
      toast({ title: "Nenhuma Bola", description: "Pelo menos uma bola deve ser preenchida!", variant: "destructive" });
      return;
    }
    
    const uniqueBolas = new Set(bolasPreenchidas.map(b => parseInt(b)));
    if (uniqueBolas.size !== bolasPreenchidas.length) {
        toast({ title: "Bolas Repetidas", description: "Os números das bolas não podem se repetir.", variant: "destructive" });
        return;
    }

    onSave(formData);
  };

  const ballFields = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-caixa-branco border-caixa-cinzaMedio shadow-lg">
        <CardHeader className="border-b border-caixa-cinza">
          <CardTitle className="text-center text-2xl font-bold text-caixa-azul">
            {concurso ? 'Editar Concurso' : 'Novo Concurso'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="concurso" className="text-caixa-azulEscuro font-medium">Concurso *</Label>
                <Input
                  id="concurso"
                  name="concurso"
                  value={formData.concurso}
                  onChange={handleChange}
                  placeholder="Ex: 2650"
                  className="input-caixa"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="data" className="text-caixa-azulEscuro font-medium">Data *</Label>
                <Input
                  id="data"
                  name="data"
                  type="date"
                  value={formData.data}
                  onChange={handleChange}
                  className="input-caixa"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-semibold text-caixa-azulEscuro">Números Sorteados (1-60)</Label>
              <div className="form-grid">
                {ballFields.map((num) => (
                  <motion.div
                    key={num}
                    className="space-y-1"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Label htmlFor={`bola${num}`} className="text-xs text-caixa-cinzaEscuro">Bola {num}</Label>
                    <Input
                      id={`bola${num}`}
                      name={`bola${num}`}
                      type="number"
                      min="1"
                      max="60"
                      value={formData[`bola${num}`]}
                      onChange={handleChange}
                      placeholder="-"
                      className="input-caixa text-center font-medium"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 btn-caixa-primary font-semibold"
              >
                {concurso ? 'Atualizar Concurso' : 'Salvar Concurso'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 btn-caixa-outline font-semibold"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConcursoForm;