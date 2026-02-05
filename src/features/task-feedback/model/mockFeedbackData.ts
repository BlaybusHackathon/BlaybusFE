import type { FeedbackWithAuthor, AnswerWithAuthor, FeedbackWithTask } from './types';

export const MOCK_FEEDBACKS: FeedbackWithAuthor[] = [
  {
    id: 'fb-1',
    content: '**예문과 함께** 다시 한 번 복습해보세요.',
    imageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    xPos: 70,
    yPos: 35,
    taskId: 'task-1',
    mentorId: 'mentor-1',
    imageId: 'img-1',
    authorName: '김멘토',
    authorProfileUrl: null,
  },
  {
    id: 'fb-2',
    content: '이 부분은 잘 정리했네요. **핵심 개념**을 잘 파악했습니다.',
    imageUrl: 'https://placehold.co/600x800',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    xPos: 30,
    yPos: 60,
    taskId: 'task-1',
    mentorId: 'mentor-1',
    imageId: 'img-1',
    authorName: '김멘토',
    authorProfileUrl: null,
  }
];

export const MOCK_FEEDBACKS_With_Task: FeedbackWithTask[] = [
  {
    id: 'fb-1',
    content: '**예문과 함께** 다시 한 번 복습해보세요.',
    imageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    xPos: 70,
    yPos: 35,
    taskId: 'task-1',
    mentorId: 'mentor-1',
    imageId: 'img-1',
    authorName: '김멘토',
    authorProfileUrl: null,
    taskTitle: '영어 독해 3단원: 주장 찾기'

  },
  {
    id: 'fb-2',
    content: '이 부분은 잘 정리했네요. **핵심 개념**을 잘 파악했습니다.',
    imageUrl: 'https://placehold.co/600x800',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    xPos: 30,
    yPos: 60,
    taskId: 'task-1',
    mentorId: 'mentor-1',
    imageId: 'img-1',
    authorName: '김멘토',
    authorProfileUrl: null,
    taskTitle: '영어 독해 3단원: 주장 찾기'
  }
];

export const MOCK_ANSWERS: AnswerWithAuthor[] = [
  {
    id: 'ans-1',
    comment: '네, 알겠습니다! 예문 찾아서 정리해볼게요.',
    userId: 'mentee-1',
    feedbackId: 'fb-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    authorName: '이멘티',
    authorRole: 'MENTEE',
    authorProfileUrl: null
  },
  {
    id: 'ans-2',
    comment: '좋아요, 화이팅!',
    userId: 'mentor-1',
    feedbackId: 'fb-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    authorName: '김멘토',
    authorRole: 'MENTOR',
    authorProfileUrl: null
  }
];

export const MOCK_SUBMISSION_IMAGES = [
  { id: 'img-1', imageUrl: 'https://placehold.co/600x800' },
  { id: 'img-2', imageUrl: 'https://placehold.co/600x800' }
];