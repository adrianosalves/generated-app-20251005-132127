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
import { VacancyForm } from './VacancyForm';
import { useDataActions } from '@/stores/useDataStore';
import type { CreateVacancy } from '@shared/types';
export function CreateVacancyDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createVacancy } = useDataActions();
  const handleSubmit = async (data: CreateVacancy) => {
    setIsSubmitting(true);
    const result = await createVacancy(data);
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
          Criar Vaga
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Vaga</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para adicionar uma nova vaga de emprego.
          </DialogDescription>
        </DialogHeader>
        <VacancyForm
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}