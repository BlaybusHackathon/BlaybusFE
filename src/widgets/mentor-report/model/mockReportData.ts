export interface ReportData {
    id?: string;
    menteeId: string;  
    startDate: string;  
    endDate: string;   
    totalReview: string;
    wellDone: string;
    improvements: string;
}

export const MOCK_REPORT_DB: ReportData[] = [
    {
        id: '1',
        menteeId: '1', 
        startDate: '2026-02-01',
        endDate: '2026-02-07',
        totalReview: '첫 주 동안 새로운 학습 흐름에 적응하느라...',
        wellDone: '과제를 대하는 태도에서 성실함이...',
        improvements: '학습량을 늘리기보다는...',
    },
    {
        id: '2',
        menteeId: '2', 
        startDate: '2026-02-01',
        endDate: '2026-02-07',
        totalReview: '수학 기초가 부족해 보입니다...',
        wellDone: '질문을 많이 하는 점이 좋습니다.',
        improvements: '풀이 과정을 꼼꼼히 적는 연습이 필요합니다.',
    }
];