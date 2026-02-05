import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PublicRoute } from './PublicRoute';
import { RootRedirect } from './RootRedirect';
import { MainLayout } from '@/widgets/main-layout/MainLayout'; // [핵심] 통합 레이아웃 하나만 사용
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

  // [변경 사항] 모든 인증된 라우트는 MainLayout 하나로 통합
  // MainLayout 내부에서 화면 크기에 따라 (Sidebar vs Header/BottomNav)가 결정됨
  // 메뉴 항목은 로그인한 유저의 Role에 따라 결정됨
  {
    element: <MainLayout />, 
    children: [
      // ---------------------------------------------------
      // Mentee Routes
      // ---------------------------------------------------
      // 기존에는 플래너가 레이아웃 밖에 있었지만, 이제는 반응형 레이아웃 안으로 들어옵니다.
      // (PC에선 사이드바, 모바일에선 헤더/탭바가 보임)
      { path: '/mentee/planner', element: withSuspense(MenteePlannerPage) },
      { path: '/mentee/task/:taskId', element: withSuspense(MenteeTaskDetailPage) },
      { path: '/mentee/feedback', element: withSuspense(MenteeFeedbackPage) },
      { path: '/mentee/mypage', element: withSuspense(MenteeMyPage) },

      // ---------------------------------------------------
      // Mentor Routes
      // ---------------------------------------------------
      { path: '/mentor', element: withSuspense(MentorMyPage) }, // 대시보드
      { path: '/mentor/mypage', element: withSuspense(MentorMyPage) },

      { path: '/mentor/mentee/:menteeId', element: withSuspense(MentorMenteeManagePage) },
      { path: '/mentor/mentee/:menteeId/calendar', element: withSuspense(MentorMenteeCalendarPage) },
      { path: '/mentor/mentee/:menteeId/feedback', element: withSuspense(MentorMenteeFeedbackPage) },
      { path: '/mentor/mentee/:menteeId/task/:taskId', element: withSuspense(MentorTaskDetailPage) },

      // 주간 리포트
      { path: '/mentor/mentee/:menteeId/report', element: withSuspense(MentorReportPage) },
      { path: '/mentor/mentee/:menteeId/report/new', element: withSuspense(MentorReportPage) },
      { path: '/mentor/mentee/:menteeId/report/:reportId', element: withSuspense(MentorReportPage) },

      // 줌 피드백
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