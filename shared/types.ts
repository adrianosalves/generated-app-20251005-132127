export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// COSTUMA Talentos specific types
export type VacancyStatus = 'Open' | 'Sourcing' | 'Interviewing' | 'Offer' | 'Closed';
export type Priority = 'High' | 'Medium' | 'Low';
export type CandidateAppStatus = 'Active' | 'Inactive' | 'Hired';
export type CandidateStage = 'Sourced' | 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired';
export interface Candidate {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  appliedFor: string; // This will be the vacancy title
  status: CandidateAppStatus;
  stage: CandidateStage;
  appliedDate: string;
}
// A smaller representation of a candidate for embedding in a vacancy
export interface VacancyCandidate {
  id: string;
  name: string;
  avatarUrl: string;
}
export interface Vacancy {
  id: string;
  title: string;
  department: string;
  status: VacancyStatus;
  priority: Priority;
  createdAt: string;
  candidates: VacancyCandidate[];
}
export interface DashboardSummary {
  activeVacancies: number;
  newCandidates: number;
  interviewsToday: number;
  hiredThisMonth: number;
}
// Types for CRUD operations
export type CreateVacancy = Omit<Vacancy, 'id' | 'createdAt' | 'candidates'>;
export type UpdateVacancy = Partial<Omit<Vacancy, 'id' | 'createdAt' | 'candidates'>>;
export type CreateCandidate = Omit<Candidate, 'id' | 'appliedDate' | 'avatarUrl'>;
export type UpdateCandidate = Partial<CreateCandidate>;