import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Award, MoreHorizontal, UserCheck, CalendarCheck } from "lucide-react";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from '@/stores/useDataStore';
import { useDataActions } from '@/stores/useDataStore';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Vacancy, VacancyStatus } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isThisMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { vacancyStatuses, vacancyStatusTranslations, candidateStages, candidateStageTranslations } from '@/lib/translations';
function VacancyCard({ vacancy }: { vacancy: Vacancy }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: vacancy.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="bg-card hover:bg-muted/80 cursor-grab active:cursor-grabbing transition-colors duration-200">
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-sm">{vacancy.title}</h4>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{vacancy.department}</p>
          <div className="flex items-center justify-between mt-2">
            <Badge variant={vacancy.priority === 'High' ? 'destructive' : 'secondary'}>{vacancy.priority}</Badge>
            <div className="flex -space-x-2">
              {vacancy.candidates.slice(0, 2).map(c => (
                <Avatar key={c.id} className="h-6 w-6 border-2 border-card">
                  <AvatarImage src={c.avatarUrl} />
                  <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export function HomePage() {
  const vacancies = useDataStore((state) => state.vacancies);
  const candidates = useDataStore((state) => state.candidates);
  const loading = useDataStore((state) => state.loading);
  const { fetchVacancies, fetchCandidates, updateVacancy } = useDataActions();
  useEffect(() => {
    if (vacancies.length === 0) fetchVacancies();
    if (candidates.length === 0) fetchCandidates();
  }, [fetchVacancies, fetchCandidates, vacancies.length, candidates.length]);
  const dashboardStats = useMemo(() => {
    const activeVacancies = vacancies.filter(v => v.status !== 'Closed').length;
    const newCandidates = candidates.filter(c => isThisMonth(new Date(c.appliedDate))).length;
    const interviewsToday = candidates.filter(c => c.stage === 'Interview').length;
    const hiredThisMonth = candidates.filter(c => c.stage === 'Hired' && isThisMonth(new Date(c.appliedDate))).length;
    return { activeVacancies, newCandidates, interviewsToday, hiredThisMonth };
  }, [vacancies, candidates]);
  const candidateFunnelData = useMemo(() => {
    return candidateStages.map(stage => ({
      name: candidateStageTranslations[stage],
      value: candidates.filter(c => c.stage === stage).length,
    }));
  }, [candidates]);
  const recentActivities = useMemo(() => {
    const sortedCandidates = [...candidates].sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
    return sortedCandidates.slice(0, 4).map(c => ({
      icon: UserCheck,
      text: `${c.name} candidatou-se para '${c.appliedFor}'.`,
      time: format(new Date(c.appliedDate), "d MMM, yyyy", { locale: ptBR }),
    }));
  }, [candidates]);
  const vacanciesByStatus = useMemo(() => {
    const grouped: Record<string, Vacancy[]> = {};
    vacancyStatuses.forEach(stage => { grouped[stage] = []; });
    vacancies.forEach(vacancy => {
      if (grouped[vacancy.status]) {
        grouped[vacancy.status].push(vacancy);
      }
    });
    return grouped;
  }, [vacancies]);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const activeVacancy = vacancies.find(v => v.id === activeId);
    if (!activeVacancy) return;
    const overContainerId = over.data.current?.sortable?.containerId || over.id;
    if (vacancyStatuses.includes(overContainerId as VacancyStatus)) {
      const newStatus = overContainerId as VacancyStatus;
      if (activeVacancy.status !== newStatus) {
        updateVacancy(activeVacancy.id, { status: newStatus });
      }
    }
  };
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vagas Ativas</CardTitle>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.vacancies ? <Skeleton className="h-8 w-12" /> : <div className="text-3xl font-bold">{dashboardStats.activeVacancies}</div>}
            <p className="text-xs text-muted-foreground">Atualmente abertas para candidaturas</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Novos Candidatos</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.candidates ? <Skeleton className="h-8 w-12" /> : <div className="text-3xl font-bold">{dashboardStats.newCandidates}</div>}
            <p className="text-xs text-muted-foreground">Candidataram-se este mês</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Entrevista</CardTitle>
            <CalendarCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.candidates ? <Skeleton className="h-8 w-12" /> : <div className="text-3xl font-bold">{dashboardStats.interviewsToday}</div>}
            <p className="text-xs text-muted-foreground">Candidatos em fase de entrevista</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contratados Este Mês</CardTitle>
            <Award className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.candidates ? <Skeleton className="h-8 w-12" /> : <div className="text-3xl font-bold">{dashboardStats.hiredThisMonth}</div>}
            <p className="text-xs text-muted-foreground">Colocações bem-sucedidas</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Pipeline de Vagas</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto pb-4">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="flex gap-4 min-w-max">
                {vacancyStatuses.map(stage => (
                  <div key={stage} className="flex-1 min-w-[240px] bg-muted/50 rounded-lg p-3">
                    <h3 className="font-semibold mb-3 text-sm text-muted-foreground tracking-wider uppercase">{vacancyStatusTranslations[stage]}</h3>
                    <SortableContext id={stage} items={vacanciesByStatus[stage]?.map(v => v.id) || []} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3 min-h-[100px]">
                        {loading.vacancies ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />) :
                          vacanciesByStatus[stage]?.map(vacancy => (
                            <VacancyCard key={vacancy.id} vacancy={vacancy} />
                          ))}
                      </div>
                    </SortableContext>
                  </div>
                ))}
              </div>
            </DndContext>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-8">
          <Card className="flex-1 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Funil de Candidatos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={candidateFunnelData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={80} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="flex-1 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading.candidates ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="flex items-start gap-3"><Skeleton className="h-8 w-8 rounded-full" /><div className="space-y-1"><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-20" /></div></div>) :
                  recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-muted rounded-full p-2">
                        <activity.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}