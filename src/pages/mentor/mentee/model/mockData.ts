import { MenteeProfileData } from './types';

export const MOCK_MENTEE_PROFILE: MenteeProfileData = {
  id: 'mentee-1',
  name: '최연준',
  school: '?�울고등?�교',
  grade: '2?�년',
  profileImgUrl: 'https://bit.ly/dan-abramov', 
  stats: {
    todaySubmitted: 2,
    todayRemaining: 1,
    todayFeedbackComments: 3,
    todayTasksCount: 15,
  },
  achievement: {
    korean: 72,
    english: 88,
    math: 45,
  },
};