import { TaskFeedback } from '@/entities/task-feedback/types';
import { Answer } from '@/entities/answer/types';
import { Subject, UserRole } from '@/shared/constants/enums';

export type FeedbacksByImage = Record<string, TaskFeedback[]>;

export type AnswersByFeedback = Record<string, Answer[]>;

export interface CreateFeedbackDto {
  content: string;
  imageUrl?: string;
  xPos: number;
  yPos: number;
  taskId: string;
  imageId: string;
}

export interface UpdateFeedbackDto {
  content?: string;
  imageUrl?: string | null;
}

export interface CreateAnswerDto {
  comment: string;
  feedbackId: string;
}

export type CommentMode = 'view' | 'create' | 'edit';

export interface AnswerWithAuthor extends Answer {
  authorName: string;
  authorRole: UserRole;
  authorProfileUrl: string | null;
}

export interface FeedbackWithAuthor extends TaskFeedback {
  authorName: string;
  authorProfileUrl: string | null;
  subject?: Subject;
}

export interface FeedbackWithTask extends TaskFeedback {
    authorName: string;
    authorProfileUrl: string | null;
    subject?: Subject;
    taskTitle: string;
}