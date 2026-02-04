import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PublicRoute } from './PublicRoute';
import { RootRedirect } from './RootRedirect';
import { MenteeLayout } from './MenteeLayout';
import { MentorLayout } from './MentorLayout';
import { Loading } from '@/shared/ui/Loading';

// --- Lazy Load Pages ---

// Auth
const LoginPage = lazy(() => import('@/pages/login'));

// Mentee Pages
const MenteePlannerPage = lazy(() => import('@/pages/mentee/planner'));
const MenteeTaskDetailPage = lazy(() => import('@/pages/mentee/task/[id]'));
const MenteeFeedbackPage = lazy(() => import('@/pages/mentee/feedback'));
const MenteeMyPage = lazy(() => import('@/pages/mentee/mypage'));

// Mentor Pages
const MentorMyPage = lazy(() => import('@/pages/mentor/mypage'));

// Mentor - Mentee Management Pages
const MentorMenteeManagePage = lazy(() => import('@/pages/mentor/mentee'));
const MentorMenteeCalendarPage = lazy(() => import('@/pages/mentor/mentee/calendar'));
const MentorMenteeFeedbackPage = lazy(() => import('@/pages/mentor/mentee/feedback'));
const MentorTaskDetailPage = lazy(() => import('@/pages/mentor/task/detail'));
const MentorReportPage = lazy(() => import('@/pages/mentor/mentee/report'));


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
      { index: true, element: <MentorMyPage /> },

      { path: 'mentee/:menteeId', element: <MentorMenteeManagePage /> },
      { path: 'mentee/:menteeId/calendar', element: <MentorMenteeCalendarPage /> },
      { path: 'mentee/:menteeId/feedback', element: <MentorMenteeFeedbackPage /> },
      { path: 'mentee/:menteeId/task/:taskId', element: <MentorTaskDetailPage /> },
      { path: 'mentee/:menteeId/report', element: <MentorReportPage /> },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);