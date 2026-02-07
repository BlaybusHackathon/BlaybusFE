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
        }
    ];
};
