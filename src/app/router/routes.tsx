import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PublicRoute } from './PublicRoute';
import { RootRedirect } from './RootRedirect.tsx';
import { MenteeLayout } from './MenteeLayout.tsx';
import { MentorLayout } from './MentorLayout.tsx';
import { Loading } from '@/shared/ui/Loading';

// Lazy Load Pages
const LoginPage = lazy(() => import('@/pages/login'));

// Mentee Pages
const MenteePlannerPage = lazy(() => import('@/pages/mentee/planner'));
const MenteeTaskDetailPage = lazy(() => import('@/pages/mentee/task/[id]'));
const MenteeFeedbackPage = lazy(() => import('@/pages/mentee/feedback'));
const MenteeMyPage = lazy(() => import('@/pages/mentee/mypage'));

// Mentor Pages
const MentorDashboardPage = lazy(() => import('@/pages/mentor/dashboard'));
const MentorTaskCreatePage = lazy(() => import('@/pages/mentor/task/create'));
const MentorFeedbackWritePage = lazy(() => import('@/pages/mentor/feedback/write/[menteeId]'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Suspense fallback={<Loading />}>
          <LoginPage />
        </Suspense>
      </PublicRoute>
    ),
  },
  // Mentee Routes
  {
    path: '/mentee',
    element: <MenteeLayout />,
    children: [
      { path: 'planner', element: <MenteePlannerPage /> },
      { path: 'task/:taskId', element: <MenteeTaskDetailPage /> },
      { path: 'feedback', element: <MenteeFeedbackPage /> },
      { path: 'mypage', element: <MenteeMyPage /> },
    ],
  },
  // Mentor Routes
  {
    path: '/mentor',
    element: <MentorLayout />,
    children: [
      { path: 'dashboard', element: <MentorDashboardPage /> },
      { path: 'task/create', element: <MentorTaskCreatePage /> },
      { path: 'feedback/write/:menteeId', element: <MentorFeedbackWritePage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);