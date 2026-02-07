import { TaskFeedback } from '@/entities/task-feedback/types';
import { Answer } from '@/entities/answer/types';

// 파일 데이터 타입
export interface FileData {
  title: string;
  url: string;
}

// 과제 상세 전체 데이터 타입
export interface TaskDetailFullData {
  id: string;
  title: string;
  subject: 'KOREAN' | 'ENGLISH' | 'MATH';
  taskDate: string;
  isMentorChecked: boolean;
  description?: string;
  
  // 학습 자료
  taskFile: FileData | null;
  weakness: {
    title: string;
    file: FileData | null;
  } | null;

  // 제출 및 피드백 상태
  submission: {
    id: string;
    images: string[]; // 이미지 URL
    memo: string;
    isFeedbackReceived: boolean; 
  } | null;
}

// ==========================================
// 1. 과제 DB (시나리오별 데이터)
// ==========================================
export const MOCK_TASK_DB: Record<string, TaskDetailFullData> = {
  // Case 1: 미제출 과제 (학습 자료 테스트용)
  // -> 로컬 파일 연결됨
  'task-1': {
    id: 'task-1',
    title: '수학 1단원: 지수와 로그 기본',
    subject: 'MATH',
    taskDate: '2024-02-12',
    isMentorChecked: false,
    description: '계산 실수 줄이기',
    
    // [수정] 보완점 파일 -> 로컬 PDF 연결
    weakness: { 
      title: '계산 실수', 
      file: { 
        title: '실제_PDF_테스트.pdf', 
        url: '/test-files/sample_math.pdf' 
      } 
    },
    
    // [수정] 과제 파일 -> 로컬 이미지 연결
    taskFile: { 
      title: '실제_이미지_테스트.jpg', 
      url: '/test-files/sample_image.png' 
    },
    
    submission: null,
  },
  
  // Case 2: 제출 완료 (수정하기 버튼 테스트용)
  // -> 이미 제출된 이미지도 로컬 파일로 테스트 가능
  'task-2': {
    id: 'task-2',
    title: '영어 독해: 빈칸 추론 정복',
    subject: 'ENGLISH',
    taskDate: '2024-02-12',
    isMentorChecked: false,
    description: '문맥 파악 능력',
    taskFile: { title: '빈칸추론_마스터.pdf', url: '#' },
    weakness: { title: '문맥 파악', file: { title: '구문독해_워크북.pdf', url: '#' } },
    submission: {
      id: 'sub-2',
      // [수정] 제출했던 이미지도 로컬 이미지로 테스트 (화면에 잘 뜨는지 확인용)
      images: ['/test-files/sample_image.jpg'],
      memo: '2번 지문이 해석이 잘 안됩니다.',
      isFeedbackReceived: false,
    },
  },

  // Case 3: 피드백 완료 (피드백 확인 뷰)
  'task-3': {
    id: 'task-3',
    title: '국어 문학: 현대시 해석',
    subject: 'KOREAN',
    taskDate: '2024-02-11',
    isMentorChecked: true,
    description: '시어의 상징적 의미 파악',
    taskFile: { title: '현대시_모음집.pdf', url: '#' },
    weakness: null,
    submission: {
      id: 'sub-3',
      // 피드백 핀 테스트를 위해 외부 URL 유지 (또는 로컬 이미지로 교체 가능)
      images: [
        'https://placehold.co/600x800/png?text=Kor_Sub_1', 
        'https://placehold.co/600x800/png?text=Kor_Sub_2'
      ],
      memo: '선생님 피드백 부탁드려요!',
      isFeedbackReceived: true,
    },
  },
};

// ==========================================
// 2. 피드백 & 댓글 DB
// ==========================================
export const MOCK_FEEDBACKS_DB: Record<string, TaskFeedback[]> = {
  'img-0': [
    {
      id: 'fb-1',
      content: '이 부분 해석이 아주 좋습니다. **핵심어**를 잘 찾았네요.',
      imageUrl: null,
      xPos: 30, yPos: 40,
      createdAt: new Date().toISOString(),
      taskId: 'task-3',
      mentorId: 'mentor-1',
      imageId: 'img-0',
    },
    {
      id: 'fb-2',
      content: '여기서는 화자의 정서를 **구체적**으로 서술해야 합니다.',
      imageUrl: null,
      xPos: 60, yPos: 70,
      createdAt: new Date().toISOString(),
      taskId: 'task-3',
      mentorId: 'mentor-1',
      imageId: 'img-0',
    }
  ]
};

export const MOCK_ANSWERS_DB: Record<string, Answer[]> = {
  'fb-1': [
    {
      id: 'ans-1',
      comment: '감사합니다! 더 노력할게요.',
      userId: 'mentee-1',
      feedbackId: 'fb-1',
      createdAt: new Date().toISOString()
    }
  ]
};

// ==========================================
// 3. Helper Functions
// ==========================================
export const getTaskDetailById = (taskId: string | undefined): TaskDetailFullData | null => {
  if (!taskId || !MOCK_TASK_DB[taskId]) return null;
  return MOCK_TASK_DB[taskId];
};

export const getFeedbacksAndAnswersByImageIds = (imageIds: string[]) => {
  const feedbacks: TaskFeedback[] = [];
  const answers: Answer[] = [];

  imageIds.forEach(imgId => {
    const fbs = MOCK_FEEDBACKS_DB[imgId] || [];
    feedbacks.push(...fbs);
    
    fbs.forEach(fb => {
      const ans = MOCK_ANSWERS_DB[fb.id] || [];
      answers.push(...ans);
    });
  });

  return { feedbacks, answers };
};