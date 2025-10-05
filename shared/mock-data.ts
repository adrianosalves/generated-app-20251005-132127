import type { Vacancy, Candidate } from './types';
export const MOCK_CANDIDATES: Candidate[] = [
  { id: 'cand1', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=cand1', appliedFor: 'Senior Frontend Developer', status: 'Active', stage: 'Interview', appliedDate: '2023-10-15T00:00:00.000Z' },
  { id: 'cand2', name: 'Bob Williams', email: 'bob@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=cand2', appliedFor: 'Backend Engineer', status: 'Active', stage: 'Screening', appliedDate: '2023-10-12T00:00:00.000Z' },
  { id: 'cand3', name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=cand3', appliedFor: 'UX/UI Designer', status: 'Inactive', stage: 'Sourced', appliedDate: '2023-10-10T00:00:00.000Z' },
  { id: 'cand4', name: 'Diana Prince', email: 'diana@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=cand4', appliedFor: 'Product Manager', status: 'Active', stage: 'Offer', appliedDate: '2023-09-28T00:00:00.000Z' },
  { id: 'cand5', name: 'Ethan Hunt', email: 'ethan@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=cand5', appliedFor: 'Senior Frontend Developer', status: 'Hired', stage: 'Hired', appliedDate: '2023-09-20T00:00:00.000Z' },
];
export const MOCK_VACANCIES: Vacancy[] = [
  { id: 'vac1', title: 'Senior Frontend Developer', department: 'Engineering', status: 'Interviewing', priority: 'High', createdAt: '2023-09-01T00:00:00.000Z', candidates: [MOCK_CANDIDATES[0], MOCK_CANDIDATES[4]] },
  { id: 'vac2', title: 'Backend Engineer', department: 'Engineering', status: 'Sourcing', priority: 'High', createdAt: '2023-09-05T00:00:00.000Z', candidates: [MOCK_CANDIDATES[1]] },
  { id: 'vac3', title: 'UX/UI Designer', department: 'Design', status: 'Open', priority: 'Medium', createdAt: '2023-09-10T00:00:00.000Z', candidates: [MOCK_CANDIDATES[2]] },
  { id: 'vac4', title: 'Product Manager', department: 'Product', status: 'Offer', priority: 'Medium', createdAt: '2023-08-20T00:00:00.000Z', candidates: [MOCK_CANDIDATES[3]] },
  { id: 'vac5', title: 'DevOps Engineer', department: 'Operations', status: 'Closed', priority: 'Low', createdAt: '2023-08-15T00:00:00.000Z', candidates: [] },
  { id: 'vac6', title: 'Data Scientist', department: 'Analytics', status: 'Sourcing', priority: 'High', createdAt: '2023-10-01T00:00:00.000Z', candidates: [] },
];