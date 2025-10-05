import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Candidate, CreateCandidate, UpdateCandidate } from '@shared/types';
import { useDataStore } from '@/stores/useDataStore';
import { candidateStages, candidateStageTranslations } from '@/lib/translations';
const candidateSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('Endereço de e-mail inválido.'),
  appliedFor: z.string().min(1, 'Por favor, selecione uma vaga.'),
  status: z.enum(['Active', 'Inactive', 'Hired']),
  stage: z.enum(['Sourced', 'Applied', 'Screening', 'Interview', 'Offer', 'Hired']),
});
type CandidateFormValues = z.infer<typeof candidateSchema>;
interface CandidateFormProps {
  onSubmit: (data: CreateCandidate | UpdateCandidate) => void;
  initialData?: Candidate;
  onCancel?: () => void;
  isSubmitting?: boolean;
}
export function CandidateForm({ onSubmit, initialData, onCancel, isSubmitting }: CandidateFormProps) {
  const vacancies = useDataStore(state => state.vacancies);
  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      appliedFor: '',
      status: 'Active',
      stage: 'Applied',
    },
  });
  const handleSubmit = (data: CandidateFormValues) => {
    onSubmit(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="ex: Maria Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço de E-mail</FormLabel>
              <FormControl>
                <Input placeholder="ex: maria.silva@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="appliedFor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vaga Aplicada</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma vaga" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vacancies.map(v => <SelectItem key={v.id} value={v.title}>{v.title}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Ativo</SelectItem>
                    <SelectItem value="Inactive">Inativo</SelectItem>
                    <SelectItem value="Hired">Contratado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etapa</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {candidateStages.map(stage => (
                      <SelectItem key={stage} value={stage}>
                        {candidateStageTranslations[stage]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Candidato'}
          </Button>
        </div>
      </form>
    </Form>
  );
}