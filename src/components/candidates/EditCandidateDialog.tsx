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
import { CandidateForm } from './CandidateForm';
import { useDataActions } from '@/stores/useDataStore';
import type { UpdateCandidate, Candidate } from '@shared/types';
interface EditCandidateDialogProps {
  candidate: Candidate;
}
export function EditCandidateDialog({ candidate }: EditCandidateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateCandidate } = useDataActions();
  const handleSubmit = async (data: UpdateCandidate) => {
    setIsSubmitting(true);
    const result = await updateCandidate(candidate.id, data);
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
          <DialogTitle>Editar Candidato</DialogTitle>
          <DialogDescription>
            Atualize os detalhes de {candidate.name}.
          </DialogDescription>
        </DialogHeader>
        <CandidateForm
          onSubmit={handleSubmit}
          initialData={candidate}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}