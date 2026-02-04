export interface DashboardStats {
  uncheckedTaskCount: number;
  pendingFeedbackCount: number;
}

export interface MenteeSummary {
  id: string;
  name: string;
  profileImgUrl?: string | null;
  achievement: {
    korean: number;
    english: number;
    math: number;
  };
}

export interface RecentSubmittedTask {
  id: string;
  title: string;
  subject: string; 
  menteeId: string;
  menteeName: string;
  submittedAt: string;
}

export interface RecentFeedbackComment {
  id: string;
  content: string;
  menteeId: string;
  menteeName: string;
  taskId: string;
  feedbackId: string;
  createdAt: string;
}