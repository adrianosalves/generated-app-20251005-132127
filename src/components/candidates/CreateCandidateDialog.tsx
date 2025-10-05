import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { CandidateForm } from './CandidateForm';
import { useDataActions } from '@/stores/useDataStore';
import type { CreateCandidate } from '@shared/types';
export function CreateCandidateDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createCandidate } = useDataActions();
  const handleSubmit = async (data: CreateCandidate) => {
    setIsSubmitting(true);
    const result = await createCandidate(data);
    if (result) {
      setIsOpen(false);
    }
    setIsSubmitting(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="active:scale-95 transition-transform duration-200">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Candidato
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Candidato</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para adicionar um novo candidato ao seu banco de talentos.
          </DialogDescription>
        </DialogHeader>
        <CandidateForm
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}