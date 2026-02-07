export interface FileData {
  title: string;
  url: string;
}

export interface TaskDetailFullData {
  id: string;
  title: string;
  subject: 'KOREAN' | 'ENGLISH' | 'MATH';
  taskDate: string;
  isMentorChecked: boolean;
  description?: string; // 보완점 텍스트 등
  
  // 1. 학습 자료 섹션 데이터
  taskFile: FileData | null;
  weakness: {
    title: string;
    file: FileData | null;
  } | null;

  // 2. 제출 및 피드백 데이터
  submission: {
    id: string;
    images: string[];
    memo: string;
    isFeedbackReceived: boolean; // true: 피드백 뷰, false: 과제 상세(학습자료) 뷰
  } | null;
}

// Mock Data
export const MOCK_TASK_DETAIL_DATA: TaskDetailFullData = {
  id: 'task-1',
  title: '영어 독해 3단원: 주장 찾기',
  subject: 'ENGLISH',
  taskDate: '2024-02-10',
  isMentorChecked: true,
  description: '보완점: 주제 문장 찾기 부족',

  // 학습 자료
  taskFile: {
    title: '3단원_주장찾기_문제지.pdf',
    url: 'https://example.com/files/task.pdf'
  },
  weakness: {
    title: '주제 문장 찾기 부족',
    file: {
      title: '보완학습_주제문장_연습.pdf',
      url: 'https://example.com/files/weakness.pdf'
    }
  },

  // 제출 내역 (테스트를 위해 isFeedbackReceived 값을 변경해보세요)
  submission: {
    id: 'sub-1',
    images: ['https://placehold.co/600x800', 'https://placehold.co/600x800/png'],
    memo: '3번 문제가 특히 어려웠습니다.',
    isFeedbackReceived: true // true면 피드백 상세 페이지, false면 학습자료 페이지로 보입니다.
  }
};