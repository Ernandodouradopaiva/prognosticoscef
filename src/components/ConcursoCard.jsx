import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit, Trash2, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const ConcursoCard = ({ concurso, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Data inválida';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';
    
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const correctedDate = new Date(date.getTime() + userTimezoneOffset);

    return correctedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getBallNumbers = () => {
    const balls = [];
    for (let i = 1; i <= 15; i++) {
      const ballValue = concurso[`bola${i}`];
      if (ballValue !== null && ballValue !== undefined && ballValue !== '') {
        balls.push(parseInt(ballValue));
      }
    }
    return balls.sort((a, b) => a - b);
  };

  const ballNumbers = getBallNumbers();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0, 92, 169, 0.2)" }}
      className="h-full"
    >
      <Card className="bg-caixa-branco border-caixa-cinzaMedio shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
        <CardHeader className="pb-3 border-b border-caixa-cinza">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-caixa-azul">
              {concurso.concurso}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-caixa-cinzaEscuro pt-1">
              <CalendarDays className="w-4 h-4 text-caixa-laranja" />
              {formatDate(concurso.data)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 flex-grow flex flex-col justify-between">
          <div>
            <CardDescription className="text-sm font-medium text-caixa-azulEscuro mb-2">Números Sorteados:</CardDescription>
            {ballNumbers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ballNumbers.map((number, index) => (
                  <motion.div
                    key={index}
                    className="lottery-ball"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {String(number).padStart(2, '0')}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-caixa-cinzaEscuro italic text-sm">Nenhum número registrado.</p>
            )}
          </div>

          <div className="flex gap-3 pt-4 mt-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(concurso)}
              className="flex-1 btn-caixa-outline text-xs sm:text-sm"
            >
              <Edit className="w-3.5 h-3.5 mr-1.5" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(concurso.id)}
              className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs sm:text-sm"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConcursoCard;