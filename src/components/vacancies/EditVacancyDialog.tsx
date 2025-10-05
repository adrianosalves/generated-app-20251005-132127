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
import { Edit } from 'lucide-react';
import { VacancyForm } from './VacancyForm';
import { useDataActions } from '@/stores/useDataStore';
import type { UpdateVacancy, Vacancy } from '@shared/types';
interface EditVacancyDialogProps {
  vacancy: Vacancy;
}
export function EditVacancyDialog({ vacancy }: EditVacancyDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateVacancy } = useDataActions();
  const handleSubmit = async (data: UpdateVacancy) => {
    setIsSubmitting(true);
    const result = await updateVacancy(vacancy.id, data);
    if (result) {
      setIsOpen(false);
    }
    setIsSubmitting(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Vaga</DialogTitle>
          <DialogDescription>
            Atualize os detalhes para a posição de "{vacancy.title}".
          </DialogDescription>
        </DialogHeader>
        <VacancyForm
          onSubmit={handleSubmit}
          initialData={vacancy}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}