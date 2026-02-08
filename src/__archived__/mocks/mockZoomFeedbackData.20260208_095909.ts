export interface ZoomFeedbackData {
    id?: string;
    memo: string;
    subjects: {
        korean: string;
        english: string;
        math: string;
    };
    operation: string;
}

export const MOCK_ZOOM_FEEDBACK_DATA: ZoomFeedbackData = {
    memo: '오늘 학생이 조금 피곤해 보였으나 수업 태도는 좋았음. 다음 시간에는 숙제 검사를 조금 더 꼼꼼히 해야 할 듯.',
    subjects: {
        korean: '문학 개념어 정리가 잘 되어 있음. 비문학 독해 속도를 조금 더 높이는 연습 필요.',
        english: '빈칸 추론 문제에서 오답률이 높음. 문맥 파악 훈련 강화 필요.',
        math: '미적분 수열의 극한 킬러 문항 2문제 질문 해결. 기본 계산 실수가 잦으니 주의.',
    },
    operation: '다음 주 수요일 저녁 8시로 시간 변경 요청함. 학원 스케줄 조정 필요.',
};

export const MOCK_ZOOM_FEEDBACKS = [
    {
        id: '1',
        meetingDate: '2026-02-05',
        summary: '수학 문제 풀이 방식에 대한 피드백 진행함. 전반적으로 이해도가 높으나 계산 실수가 잦음.'
    },
    {
        id: '2',
        meetingDate: '2026-01-29',
        summary: '영어 단어 암기 상태 점검. 꾸준히 하고 있으나 독해 속도가 느림.'
    }
];

export const getZoomFeedbackById = (id: string): ZoomFeedbackData | undefined => {
    // In a real app, you would fetch by ID. 
    // For mock, we just return the single mock data object if ID exists in the list.
    const exists = MOCK_ZOOM_FEEDBACKS.some(item => item.id === id);
    if (exists) {
        return { ...MOCK_ZOOM_FEEDBACK_DATA, id };
    }
    return undefined;
};
