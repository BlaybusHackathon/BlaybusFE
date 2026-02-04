// 댓글 타입 정의
export interface Comment {
    id: string;
    author: string;
    role: 'MENTOR' | 'MENTEE';
    content: string;
    createdAt: string;
}

export const MOCK_TASK_DETAIL_DATA = {
    taskId: '1',
    subject: '영어',
    date: '2026년 2월 5일',
    isMentorChecked: true,
    title: '영어 단어 20개',
    description: '보완점: 단어암기',
    submissionImages: [
        'https://via.placeholder.com/600x800?text=Submission+1',
        'https://via.placeholder.com/600x800?text=Submission+2',
    ],
    menteeComment: '틀린 단어는 체크해두었고, 다음 복습 때 예문이랑 같이 다시 외울 예정입니다.',
};
