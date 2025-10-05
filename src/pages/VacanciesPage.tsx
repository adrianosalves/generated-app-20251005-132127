import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDataStore } from "@/stores/useDataStore";
import { useDataActions } from "@/stores/useDataStore";
import { CreateVacancyDialog } from "@/components/vacancies/CreateVacancyDialog";
import { DeleteVacancyAlert } from "@/components/vacancies/DeleteVacancyAlert";
import { EditVacancyDialog } from "@/components/vacancies/EditVacancyDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { vacancyStatuses, vacancyStatusTranslations } from "@/lib/translations";
export function VacanciesPage() {
  const vacancies = useDataStore((state) => state.vacancies);
  const loading = useDataStore((state) => state.loading);
  const { fetchVacancies } = useDataActions();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  useEffect(() => {
    if (vacancies.length === 0) fetchVacancies();
  }, [fetchVacancies, vacancies.length]);
  const filteredVacancies = useMemo(() => {
    return vacancies.filter(vacancy => {
      const matchesSearch = vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || vacancy.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vacancies, searchTerm, statusFilter]);
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Vagas</h1>
          <p className="text-muted-foreground">Gerencie todas as suas vagas de emprego.</p>
        </div>
        <CreateVacancyDialog />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Todas as Vagas</CardTitle>
          <CardDescription>Uma lista de todas as vagas de emprego atuais e passadas.</CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <Input
              placeholder="Filtrar por título ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Todos os Status</SelectItem>
                {vacancyStatuses.map(status => <SelectItem key={status} value={status}>{vacancyStatusTranslations[status]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Candidatos</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading.vacancies ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                filteredVacancies.map((vacancy) => (
                  <TableRow key={vacancy.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{vacancy.title}</TableCell>
                    <TableCell>{vacancy.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{vacancyStatusTranslations[vacancy.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={vacancy.priority === 'High' ? 'destructive' : 'secondary'}>
                        {vacancy.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {vacancy.candidates.slice(0, 3).map(candidate => (
                          <Avatar key={candidate.id} className="h-8 w-8 border-2 border-card">
                            <AvatarImage src={candidate.avatarUrl} />
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {vacancy.candidates.length > 3 && (
                          <Avatar className="h-8 w-8 border-2 border-card">
                            <AvatarFallback>+{vacancy.candidates.length - 3}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(vacancy.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <EditVacancyDialog vacancy={vacancy} />
                        <DeleteVacancyAlert vacancyId={vacancy.id} vacancyTitle={vacancy.title} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}