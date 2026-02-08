export interface TaskFeedback {
  id: string;
  content: string;          
  imageUrl: string | null;   
  createdAt: string;        
  xPos: number;             
  yPos: number;              
  taskId: string;
  mentorId: string;
  imageId: string;          
}

import { asRecord, asString, asNumber, asOptionalString, pick } from '@/shared/api/parse';

export const mapTaskFeedbackFromApi = (raw: unknown): TaskFeedback => {
  const obj = asRecord(raw, 'TaskFeedback');
  return {
    id: asString(pick(obj, ['id', 'feedbackId', 'feedback_id']), 'TaskFeedback.id'),
    content: asString(pick(obj, ['content']), 'TaskFeedback.content'),
    imageUrl: asOptionalString(pick(obj, ['imageUrl', 'image_url']), 'TaskFeedback.imageUrl') ?? null,
    createdAt: asString(pick(obj, ['createdAt', 'created_at']), 'TaskFeedback.createdAt'),
    xPos: asNumber(pick(obj, ['xPos', 'x_pos']), 'TaskFeedback.xPos'),
    yPos: asNumber(pick(obj, ['yPos', 'y_pos']), 'TaskFeedback.yPos'),
    taskId: asOptionalString(pick(obj, ['taskId', 'task_id']), 'TaskFeedback.taskId') ?? '',
    mentorId: asOptionalString(pick(obj, ['mentorId', 'mentor_id']), 'TaskFeedback.mentorId') ?? '',
    imageId: asOptionalString(pick(obj, ['imageId', 'image_id']), 'TaskFeedback.imageId') ?? '',
  };
};
