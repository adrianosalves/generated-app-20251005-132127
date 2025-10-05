import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { HomePage } from '@/pages/HomePage';
import { VacanciesPage } from '@/pages/VacanciesPage';
import { CandidatesPage } from '@/pages/CandidatesPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/vacancies', element: <VacanciesPage /> },
      { path: '/candidates', element: <CandidatesPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
    ],
  },
]);