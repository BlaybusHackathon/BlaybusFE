export interface TaskFeedback {
  id: string;
  content: string;
  createdAt: string;
  xPos: number;
  yPos: number;
  taskId: string;
  mentorId: string;
  imageId: string;
}

export const mapTaskFeedbackFromApi = (raw: any): TaskFeedback => ({
  id: String(raw.id),
  content: raw.content,
  createdAt: raw.created_at,
  xPos: raw.x_pos,
  yPos: raw.y_pos,
  taskId: String(raw.task_id),
  mentorId: String(raw.mentor_id),
  imageId: String(raw.image_id),
});