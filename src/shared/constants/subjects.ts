export type Subject = 'KOREAN' | 'ENGLISH' | 'MATH' | 'OTHER';

export const SUBJECT_LABELS: Record<Subject, string> = {
  KOREAN: '국어',
  ENGLISH: '영어',
  MATH: '수학',
  OTHER: '기타',
};

export const SUBJECT_COLORS: Record<Subject, string> = {
  KOREAN: '#35CE9D',
  MATH: '#A16AFF',
  ENGLISH: '#53A8FE', 
  OTHER: 'gray',
};