import { CalendarTask } from '../ui/TaskItem';

export interface CalendarTaskData extends CalendarTask {
    date: string; // YYYY-MM-DD format
}

export const generateMockTasks = (currentDate: Date): CalendarTaskData[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const formattedMonth = month.toString().padStart(2, '0');

    return [
        {
            id: '1',
            title: '국어 고전 시가 분석',
            subject: 'KOREAN',
            hasReview: false,
            isCompleted: true,
            date: `${year}-${formattedMonth}-02`,
        },
        {
            id: '2',
            title: '영어 단어 50개 암기',
            subject: 'ENGLISH',
            hasReview: false,
            isCompleted: true,
            date: `${year}-${formattedMonth}-02`,
        },
        {
            id: '3',
            title: '수학 미적분 예제 풀이',
            subject: 'MATH',
            hasReview: true,
            isCompleted: false,
            date: `${year}-${formattedMonth}-02`,
        },
        {
            id: '4',
            title: '국어 비문학 독해',
            subject: 'KOREAN',
            hasReview: true,
            isCompleted: false,
            date: `${year}-${formattedMonth}-03`,
        },
        {
            id: '5',
            title: '수학 기하와 벡터',
            subject: 'MATH',
            hasReview: false,
            isCompleted: true,
            date: `${year}-${formattedMonth}-15`,
        },
        {
            id: '6',
            title: '영어 독해 연습',
            subject: 'ENGLISH',
            hasReview: true,
            isCompleted: false,
            date: `${year}-${formattedMonth}-20`,
        },
        {
            id: '7',
            title: '수학 모의고사 풀이',
            subject: 'MATH',
            hasReview: true,
            isCompleted: false,
            date: `${year}-${formattedMonth}-20`,
        }
    ];
};
