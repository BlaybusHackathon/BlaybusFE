import { User } from '@/entities/user/types';

interface MockUser extends User {
  password: string; 
}

export const MOCK_USERS: MockUser[] = [
  { 
    id: 'mentor-1', 
    username: 'mentor1', 
    password: '1234', 
    name: '김멘토', 
    nickName: '열정멘토',
    role: 'MENTOR',
    profileImgUrl: 'https://bit.ly/dan-abramov', 
    fcmToken: 'dummy_token_mentor_1', 
    isAlarmEnabled: true, 
    createdAt: '2024-01-01', 
    updatedAt: null,
  },
  { 
    id: 'mentee-1', 
    username: 'mentee1', 
    password: '1234', 
    name: '이멘티', 
    nickName: '공부왕',
    role: 'MENTEE',
    profileImgUrl: 'https://bit.ly/ryan-florence',
    fcmToken: 'dummy_token_mentee_1',
    isAlarmEnabled: true,
    createdAt: '2024-01-01',
    updatedAt: null,
  },
  { 
    id: 'mentee-2', 
    username: 'mentee2', 
    password: '1234', 
    name: '박멘티', 
    nickName: '수학천재',
    role: 'MENTEE',
    profileImgUrl: null,
    fcmToken: 'dummy_token_mentee_2',
    isAlarmEnabled: false,
    createdAt: '2024-01-01',
    updatedAt: null,
  },
];