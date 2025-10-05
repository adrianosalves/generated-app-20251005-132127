import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { api } from '@/lib/api-client';
import type { Vacancy, Candidate, CreateVacancy, UpdateVacancy, CreateCandidate, UpdateCandidate, VacancyCandidate } from '@shared/types';
import { toast } from 'sonner';
interface DataState {
  vacancies: Vacancy[];
  candidates: Candidate[];
  loading: {
    vacancies: boolean;
    candidates: boolean;
  };
  actions: {
    fetchVacancies: () => Promise<void>;
    createVacancy: (data: CreateVacancy) => Promise<Vacancy | undefined>;
    updateVacancy: (id: string, data: UpdateVacancy) => Promise<Vacancy | undefined>;
    deleteVacancy: (id: string) => Promise<void>;
    fetchCandidates: () => Promise<void>;
    createCandidate: (data: CreateCandidate) => Promise<Candidate | undefined>;
    updateCandidate: (id: string, data: UpdateCandidate) => Promise<Candidate | undefined>;
    deleteCandidate: (id: string) => Promise<void>;
  };
}
const useDataStoreImpl = create<DataState>()(
  immer((set, get) => ({
    vacancies: [],
    candidates: [],
    loading: {
      vacancies: true,
      candidates: true,
    },
    actions: {
      fetchVacancies: async () => {
        try {
          set((state) => { state.loading.vacancies = true; });
          const result = await api<{ items: Vacancy[] }>('/api/vacancies');
          set((state) => { state.vacancies = result.items; });
        } catch (error) {
          console.error('Falha ao buscar vagas:', error);
          toast.error('Falha ao carregar vagas.');
        } finally {
          set((state) => { state.loading.vacancies = false; });
        }
      },
      createVacancy: async (data) => {
        try {
          const newVacancy = await api<Vacancy>('/api/vacancies', { method: 'POST', body: JSON.stringify(data) });
          set((state) => { state.vacancies.push(newVacancy); });
          toast.success('Vaga criada com sucesso!');
          return newVacancy;
        } catch (error) {
          console.error('Falha ao criar vaga:', error);
          toast.error('Falha ao criar vaga.');
          return undefined;
        }
      },
      updateVacancy: async (id, data) => {
        const originalVacancies = get().vacancies;
        const vacancyIndex = originalVacancies.findIndex((v) => v.id === id);
        if (vacancyIndex === -1) return;
        set(state => {
          const vacancy = state.vacancies.find(v => v.id === id);
          if (vacancy) {
            Object.assign(vacancy, data);
          }
        });
        try {
          const result = await api<Vacancy>(`/api/vacancies/${id}`, { method: 'PUT', body: JSON.stringify(data) });
          set(state => {
            const vacancyIndex = state.vacancies.findIndex((v) => v.id === id);
            if (vacancyIndex !== -1) {
              state.vacancies[vacancyIndex] = result;
            }
          });
          const isOnlyStatusUpdate = Object.keys(data).length === 1 && 'status' in data;
          if (!isOnlyStatusUpdate) {
            toast.success('Vaga atualizada com sucesso!');
          }
          return result;
        } catch (error) {
          console.error('Falha ao atualizar vaga:', error);
          toast.error('Falha ao atualizar vaga. Revertendo alterações.');
          set(state => { state.vacancies = originalVacancies; });
          return undefined;
        }
      },
      deleteVacancy: async (id) => {
        const originalVacancies = get().vacancies;
        set((state) => { state.vacancies = state.vacancies.filter((v) => v.id !== id); });
        try {
          await api(`/api/vacancies/${id}`, { method: 'DELETE' });
          toast.success('Vaga excluída com sucesso!');
        } catch (error) {
          console.error('Falha ao excluir vaga:', error);
          toast.error('Falha ao excluir vaga. Revertendo alterações.');
          set((state) => { state.vacancies = originalVacancies; });
        }
      },
      fetchCandidates: async () => {
        try {
          set((state) => { state.loading.candidates = true; });
          const result = await api<{ items: Candidate[] }>('/api/candidates');
          set((state) => { state.candidates = result.items; });
        } catch (error) {
          console.error('Falha ao buscar candidatos:', error);
          toast.error('Falha ao carregar candidatos.');
        } finally {
          set((state) => { state.loading.candidates = false; });
        }
      },
      createCandidate: async (data) => {
        try {
          const newCandidate = await api<Candidate>('/api/candidates', { method: 'POST', body: JSON.stringify(data) });
          set((state) => {
            state.candidates.push(newCandidate);
            const vacancy = state.vacancies.find(v => v.title === newCandidate.appliedFor);
            if (vacancy) {
              const newVacancyCandidate: VacancyCandidate = { id: newCandidate.id, name: newCandidate.name, avatarUrl: newCandidate.avatarUrl };
              if (!vacancy.candidates.some(c => c.id === newCandidate.id)) {
                vacancy.candidates.push(newVacancyCandidate);
              }
            }
          });
          toast.success('Candidato adicionado com sucesso!');
          return newCandidate;
        } catch (error) {
          console.error('Falha ao criar candidato:', error);
          toast.error('Falha ao adicionar candidato.');
          return undefined;
        }
      },
      updateCandidate: async (id, data) => {
        const originalCandidates = get().candidates;
        const candidateIndex = originalCandidates.findIndex((c) => c.id === id);
        if (candidateIndex === -1) return;
        try {
          const result = await api<Candidate>(`/api/candidates/${id}`, { method: 'PUT', body: JSON.stringify(data) });
          set(state => {
            const candidateIndex = state.candidates.findIndex((c) => c.id === id);
            if (candidateIndex !== -1) {
              state.candidates[candidateIndex] = result;
            }
            const vacancy = state.vacancies.find(v => v.title === result.appliedFor);
            if (vacancy) {
              const newVacancyCandidate: VacancyCandidate = { id: result.id, name: result.name, avatarUrl: result.avatarUrl };
              const existingIndex = vacancy.candidates.findIndex(c => c.id === result.id);
              if (existingIndex > -1) {
                vacancy.candidates[existingIndex] = newVacancyCandidate;
              } else {
                vacancy.candidates.push(newVacancyCandidate);
              }
            }
          });
          toast.success('Candidato atualizado com sucesso!');
          return result;
        } catch (error) {
          console.error('Falha ao atualizar candidato:', error);
          toast.error('Falha ao atualizar candidato. Revertendo alterações.');
          set(state => { state.candidates = originalCandidates; });
          return undefined;
        }
      },
      deleteCandidate: async (id) => {
        const originalCandidates = get().candidates;
        const candidateToDelete = originalCandidates.find(c => c.id === id);
        set((state) => {
          state.candidates = state.candidates.filter((c) => c.id !== id);
          if (candidateToDelete) {
            const vacancy = state.vacancies.find(v => v.title === candidateToDelete.appliedFor);
            if (vacancy) {
              vacancy.candidates = vacancy.candidates.filter(c => c.id !== id);
            }
          }
        });
        try {
          await api(`/api/candidates/${id}`, { method: 'DELETE' });
          toast.success('Candidato excluído com sucesso!');
        } catch (error) {
          console.error('Falha ao excluir candidato:', error);
          toast.error('Falha ao excluir candidato. Revertendo alterações.');
          set((state) => { state.candidates = originalCandidates; });
        }
      },
    },
  }))
);
export const useDataStore = useDataStoreImpl;
export const useDataActions = () => useDataStore((state) => state.actions);