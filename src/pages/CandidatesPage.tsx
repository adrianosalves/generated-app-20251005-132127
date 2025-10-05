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
import { Skeleton } from "@/components/ui/skeleton";
import { CreateCandidateDialog } from "@/components/candidates/CreateCandidateDialog";
import { EditCandidateDialog } from "@/components/candidates/EditCandidateDialog";
import { DeleteCandidateAlert } from "@/components/candidates/DeleteCandidateAlert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CandidateAppStatus } from "@shared/types";
import { candidateStages, candidateStageTranslations } from "@/lib/translations";
const statuses: CandidateAppStatus[] = ['Active', 'Inactive', 'Hired'];
export function CandidatesPage() {
  const candidates = useDataStore((state) => state.candidates);
  const loading = useDataStore((state) => state.loading);
  const { fetchCandidates } = useDataActions();
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  useEffect(() => {
    if (candidates.length === 0) fetchCandidates();
  }, [fetchCandidates, candidates.length]);
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = stageFilter === 'All' || candidate.stage === stageFilter;
      const matchesStatus = statusFilter === 'All' || candidate.status === statusFilter;
      return matchesSearch && matchesStage && matchesStatus;
    });
  }, [candidates, searchTerm, stageFilter, statusFilter]);
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Candidatos</h1>
          <p className="text-muted-foreground">Gerencie seu banco de talentos.</p>
        </div>
        <CreateCandidateDialog />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Todos os Candidatos</CardTitle>
          <CardDescription>Uma lista de todos os candidatos em seu banco de dados.</CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <Input
              placeholder="Filtrar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Todas as Etapas</SelectItem>
                {candidateStages.map(stage => <SelectItem key={stage} value={stage}>{candidateStageTranslations[stage]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Todos os Status</SelectItem>
                {statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Vaga Aplicada</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Data da Aplicação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading.candidates ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-1"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-40" /></div></div></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
                          <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-sm text-muted-foreground">{candidate.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{candidate.appliedFor}</TableCell>
                    <TableCell>
                      <Badge variant={candidate.status === 'Active' ? 'default' : 'secondary'}>
                        {candidate.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{candidateStageTranslations[candidate.stage]}</TableCell>
                    <TableCell>{new Date(candidate.appliedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <EditCandidateDialog candidate={candidate} />
                        <DeleteCandidateAlert candidateId={candidate.id} candidateName={candidate.name} />
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