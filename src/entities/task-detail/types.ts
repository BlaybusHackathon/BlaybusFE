import { Subject } from '@/shared/constants/subjects';

export interface FileData {
  title: string;
  url: string;
}

export interface TaskDetailFullData {
  id: string;
  title: string;
  subject: Subject;
  taskDate: string;
  isMentorChecked: boolean;
  description?: string;
  taskFile: FileData | null;
  weakness: {
    title: string;
    file: FileData | null;
  } | null;
  submission: {
    id: string;
    images: string[];
    imageIds?: string[];
    memo: string;
    isFeedbackReceived: boolean;
  } | null;
}
