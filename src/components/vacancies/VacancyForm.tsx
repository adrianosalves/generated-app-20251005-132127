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
import type { CreateVacancy, Vacancy } from '@shared/types';
import { vacancyStatuses, vacancyStatusTranslations } from '@/lib/translations';
const vacancySchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.'),
  department: z.string().min(2, 'O departamento é obrigatório.'),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['Open', 'Sourcing', 'Interviewing', 'Offer', 'Closed']),
});
type VacancyFormValues = z.infer<typeof vacancySchema>;
interface VacancyFormProps {
  onSubmit: (data: CreateVacancy) => void;
  initialData?: Vacancy;
  onCancel?: () => void;
  isSubmitting?: boolean;
}
export function VacancyForm({ onSubmit, initialData, onCancel, isSubmitting }: VacancyFormProps) {
  const form = useForm<VacancyFormValues>({
    resolver: zodResolver(vacancySchema),
    defaultValues: initialData || {
      title: '',
      department: '',
      priority: 'Medium',
      status: 'Open',
    },
  });
  const handleSubmit = (data: VacancyFormValues) => {
    onSubmit(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da Vaga</FormLabel>
              <FormControl>
                <Input placeholder="ex: Desenvolvedor Frontend Sênior" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <FormControl>
                <Input placeholder="ex: Engenharia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Baixa</SelectItem>
                    <SelectItem value="Medium">Média</SelectItem>
                    <SelectItem value="High">Alta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vacancyStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {vacancyStatusTranslations[status]}
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
            {isSubmitting ? 'Salvando...' : 'Salvar Vaga'}
          </Button>
        </div>
      </form>
    </Form>
  );
}