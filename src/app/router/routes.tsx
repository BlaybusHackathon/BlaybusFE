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
const MentorDashboardPage = lazy(() => import('@/pages/mentor/dashboard'));
const MentorMyPage = lazy(() => import('@/pages/mentor/mypage')); 

// Mentor - Mentee Management Pages
const MentorMenteeManagePage = lazy(() => import('@/pages/mentor/mentee')); 
const MentorMenteeCalendarPage = lazy(() => import('@/pages/mentor/mentee/calendar'));
const MentorMenteeFeedbackPage = lazy(() => import('@/pages/mentor/mentee/feedback'));


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

  {
    path: '/mentor',
    element: <MentorLayout />,
    children: [
      { index: true, element: <MentorDashboardPage /> },
      
      { path: 'mypage', element: <MentorMyPage /> },
      
      { path: 'mentee/:menteeId', element: <MentorMenteeManagePage /> },
      { path: 'mentee/:menteeId/calendar', element: <MentorMenteeCalendarPage /> },
      { path: 'mentee/:menteeId/feedback', element: <MentorMenteeFeedbackPage /> },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);