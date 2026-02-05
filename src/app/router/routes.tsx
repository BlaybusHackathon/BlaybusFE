import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PublicRoute } from './PublicRoute';
import { RootRedirect } from './RootRedirect';
import { MainLayout } from '@/widgets/main-layout/MainLayout';
import { Loading } from '@/shared/ui/Loading';

// --- Lazy Load Pages ---

// Auth
const LoginPage = lazy(() => import('@/pages/login'));

// Mentee Pages
const MenteePlannerPage = lazy(() => import('@/pages/mentee/planner'));
const MenteeCalendarPage = lazy(() => import('@/pages/mentee/calendar')); 
const MenteeTaskDetailPage = lazy(() => import('@/pages/mentee/task/[id]'));
const MenteeTaskSubmissionPage = lazy(() => import('@/pages/mentee/task/submit')); 
const MenteeFeedbackPage = lazy(() => import('@/pages/mentee/feedback'));
const MenteeMyPage = lazy(() => import('@/pages/mentee/mypage'));

// Mentor Pages
const MentorMyPage = lazy(() => import('@/pages/mentor/mypage'));

// Mentor - Mentee Management Pages
const MentorMenteeManagePage = lazy(() => import('@/pages/mentor/mentee'));
const MentorMenteeCalendarPage = lazy(() => import('@/pages/mentor/mentee/calendar'));
const MentorMenteeFeedbackPage = lazy(() => import('@/pages/mentor/mentee/feedback'));
const MentorZoomFeedbackPage = lazy(() => import('@/pages/mentor/mentee/feedback/zoom'));
const MentorTaskDetailPage = lazy(() => import('@/pages/mentor/task/detail'));
const MentorReportPage = lazy(() => import('@/pages/mentor/mentee/report'));

const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        {withSuspense(LoginPage)}
      </PublicRoute>
    ),
  },

  {
    element: <MainLayout />, 
    children: [
      { path: '/mentee/planner', element: withSuspense(MenteePlannerPage) },
      { path: '/mentee/calendar', element: withSuspense(MenteeCalendarPage) },
      
      { path: '/mentee/task/:taskId', element: withSuspense(MenteeTaskDetailPage) },
      { path: '/mentee/task/:taskId/submit', element: withSuspense(MenteeTaskSubmissionPage) },
      
      { path: '/mentee/feedback', element: withSuspense(MenteeFeedbackPage) },
      { path: '/mentee/mypage', element: withSuspense(MenteeMyPage) },

      { path: '/mentor', element: withSuspense(MentorMyPage) },
      { path: '/mentor/mypage', element: withSuspense(MentorMyPage) },

      { path: '/mentor/mentee/:menteeId', element: withSuspense(MentorMenteeManagePage) },
      { path: '/mentor/mentee/:menteeId/calendar', element: withSuspense(MentorMenteeCalendarPage) },
      { path: '/mentor/mentee/:menteeId/feedback', element: withSuspense(MentorMenteeFeedbackPage) },
      { path: '/mentor/mentee/:menteeId/task/:taskId', element: withSuspense(MentorTaskDetailPage) },

      { path: '/mentor/mentee/:menteeId/report', element: withSuspense(MentorReportPage) },
      { path: '/mentor/mentee/:menteeId/report/new', element: withSuspense(MentorReportPage) },
      { path: '/mentor/mentee/:menteeId/report/:reportId', element: withSuspense(MentorReportPage) },

      { path: '/mentor/mentee/:menteeId/zoom', element: withSuspense(MentorZoomFeedbackPage) },
      { path: '/mentor/mentee/:menteeId/zoom/new', element: withSuspense(MentorZoomFeedbackPage) },
      { path: '/mentor/mentee/:menteeId/zoom/:zoomId', element: withSuspense(MentorZoomFeedbackPage) },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);