import { Weakness } from '@/entities/weakness/types';

export const MOCK_WEAKNESSES: Weakness[] = [
  {
    id: 'w-1',
    title: '고전 시가 필수 어휘 정리',
    inforId: 'info-1',
    contentId: 'content-1',
    subject: 'KOREAN',
    fileName: '고전시가_어휘집.pdf',
    fileUrl: '#'
  },
  {
    id: 'w-2',
    title: '문법(음운의 변동) 개념 잡기',
    inforId: 'info-1',
    contentId: 'content-2',
    subject: 'KOREAN',
    fileName: '음운변동_개념정리.hwp',
    fileUrl: '#'
  },
  {
    id: 'w-3',
    title: '수열의 극한 킬러 문제 분석',
    inforId: 'info-1',
    contentId: 'content-3',
    subject: 'MATH',
    fileName: '수열극한_심화문제.pdf',
    fileUrl: '#'
  },
  {
    id: 'w-4',
    title: '빈칸 추론 유형 공략',
    inforId: 'info-1',
    contentId: 'content-4',
    subject: 'ENGLISH',
  }
];