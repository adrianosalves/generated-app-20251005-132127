import type { VacancyStatus, CandidateStage } from '@shared/types';
export const vacancyStatusTranslations: Record<VacancyStatus, string> = {
  Open: 'Aberta',
  Sourcing: 'Em Busca',
  Interviewing: 'Em Entrevista',
  Offer: 'Oferta',
  Closed: 'Fechada',
};
export const vacancyStatuses = Object.keys(vacancyStatusTranslations) as VacancyStatus[];
export const candidateStageTranslations: Record<CandidateStage, string> = {
  Sourced: 'Prospectado',
  Applied: 'Aplicou',
  Screening: 'Triagem',
  Interview: 'Entrevista',
  Offer: 'Oferta',
  Hired: 'Contratado',
};
export const candidateStages = Object.keys(candidateStageTranslations) as CandidateStage[];