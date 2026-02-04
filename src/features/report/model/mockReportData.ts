import { WeeklyReport } from '@/entities/weekly-report/types';
import { ZoomFeedback } from '@/entities/zoom-feedback/types'; 

export const MOCK_WEEKLY_REPORTS: WeeklyReport[] = [
  {
    id: 'wr-1',
    weekName: '1월 4주차', 
    startDate: '2026-01-25',
    endDate: '2026-01-31',
    overallFeedback: '방학 기간 학습 루틴 정착 완료',
    strengths: '기상 시간 준수',
    weaknesses: '탐구 과목 소홀',
    inforId: 'info-1',
  },
  {
    id: 'wr-2',
    weekName: '2월 1주차', 
    startDate: '2026-02-01',
    endDate: '2026-02-07', 
    overallFeedback: '수학 문제 풀이 속도가 향상됨',
    strengths: '수학 기출 분석',
    weaknesses: null,
    inforId: 'info-1',
  },
];

export const MOCK_ZOOM_FEEDBACKS: ZoomFeedback[] = [
  { 
    id: 'z-1', 
    meetingDate: '2026-01-10 20:00', 
    summary: '1월 월간 학습 방향성 점검', 
    createdAt: '2026-01-10', 
    inforId: 'info-1' 
  },
];