import { useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useDataStore } from "@/stores/useDataStore";
import { useDataActions } from "@/stores/useDataStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Users, Target } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { vacancyStatusTranslations, candidateStageTranslations } from "@/lib/translations";
import type { VacancyStatus, CandidateStage } from "@shared/types";
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
export function AnalyticsPage() {
  const vacancies = useDataStore((state) => state.vacancies);
  const candidates = useDataStore((state) => state.candidates);
  const loading = useDataStore((state) => state.loading);
  const { fetchVacancies, fetchCandidates } = useDataActions();
  useEffect(() => {
    if (vacancies.length === 0) fetchVacancies();
    if (candidates.length === 0) fetchCandidates();
  }, [fetchVacancies, fetchCandidates, vacancies.length, candidates.length]);
  const analyticsData = useMemo(() => {
    const hiringVelocity = candidates
      .filter(c => c.stage === 'Hired')
      .reduce((acc, c) => {
        const month = format(parseISO(c.appliedDate), 'MMM yyyy');
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    const hiringVelocityData = Object.entries(hiringVelocity)
      .map(([name, hires]) => ({ name, contratados: hires }))
      .sort((a, b) => {
        const dateA = new Date(a.name.replace(/(\w{3}) (\d{4})/, '$1 1, $2'));
        const dateB = new Date(b.name.replace(/(\w{3}) (\d{4})/, '$1 1, $2'));
        return dateA.getTime() - dateB.getTime();
      });
    const pipelineHealth = candidates.reduce((acc, c) => {
      acc[c.stage] = (acc[c.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const pipelineHealthData = Object.entries(pipelineHealth).map(([name, value]) => ({ name: candidateStageTranslations[name as CandidateStage] || name, value }));
    const vacancyStatus = vacancies.reduce((acc, v) => {
      acc[v.status] = (acc[v.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const vacancyStatusData = Object.entries(vacancyStatus).map(([name, value]) => ({ name: vacancyStatusTranslations[name as VacancyStatus] || name, value }));
    return { hiringVelocityData, pipelineHealthData, vacancyStatusData };
  }, [vacancies, candidates]);
  const totalVacancies = vacancies.length;
  const totalCandidates = candidates.length;
  const totalHired = candidates.filter(c => c.stage === 'Hired').length;
  if (loading.vacancies || loading.candidates) {
    return (
      <div className="animate-fade-in space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Análises</h1>
        <p className="text-muted-foreground">Relatórios detalhados e visualizações de seus esforços de recrutamento.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vagas</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVacancies}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Candidatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCandidates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contratados</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHired}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Saúde do Pipeline</CardTitle>
            <CardDescription>Número de candidatos em cada etapa do processo de recrutamento.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.pipelineHealthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status das Vagas</CardTitle>
            <CardDescription>Distribuição dos status das vagas de emprego atuais.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={analyticsData.vacancyStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {analyticsData.vacancyStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Velocidade de Contratação</CardTitle>
          <CardDescription>Número de candidatos contratados ao longo do tempo.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.hiringVelocityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="contratados" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}