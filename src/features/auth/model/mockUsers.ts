import { User } from '@/entities/user/types';

interface MockUser extends User {
  loginId: string;
  password: string;
}

export const MOCK_USERS: MockUser[] = [
  { 
    id: 'mentor-1', 
    loginId: 'mentor1', 
    password: '1234', 
    name: '김멘토', 
    role: 'MENTOR',
    profileImage: 'https://bit.ly/dan-abramov' 
  },
  { 
    id: 'mentee-1', 
    loginId: 'mentee1', 
    password: '1234', 
    name: '이멘티', 
    role: 'MENTEE',
    profileImage: 'https://bit.ly/ryan-florence'
  },
  { 
    id: 'mentee-2', 
    loginId: 'mentee2', 
    password: '1234', 
    name: '박멘티', 
    role: 'MENTEE' 
  },
];