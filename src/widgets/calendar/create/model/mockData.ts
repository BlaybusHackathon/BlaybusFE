import { Weakness } from './types';

// Mock Weakness Data (Mentee's weaknesses managed by Mentor)
export const MOCK_WEAKNESSES: Weakness[] = [
    { id: 'w1', label: '문법 강의/오답노트', subject: 'KOREAN' },
    { id: 'w2', label: '독서 2지문 (2)', subject: 'KOREAN' },
    { id: 'w3', label: '고전 시가 해석', subject: 'KOREAN' },
    { id: 'w4', label: '미적분 기초', subject: 'MATH' },
    { id: 'w5', label: '수열 문제 풀이', subject: 'MATH' },
    { id: 'w6', label: '빈칸 추론', subject: 'ENGLISH' },
    { id: 'w7', label: '순서 배열', subject: 'ENGLISH' },
];

export const WEEKS = ['1주차', '2주차', '3주차', '4주차', '5주차'];

export const DAYS = [
    { label: '월', value: 'MONDAY' },
    { label: '화', value: 'TUESDAY' },
    { label: '수', value: 'WEDNESDAY' },
    { label: '목', value: 'THURSDAY' },
    { label: '금', value: 'FRIDAY' },
    { label: '토', value: 'SATURDAY' },
    { label: '일', value: 'SUNDAY' },
];
