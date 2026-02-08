export interface MenteeProfileStats {
  todaySubmitted: number;
  todayTasksCount: number;
  todayRemaining: number;
  todayFeedbackComments: number;
}

export interface MenteeAchievement {
  korean: number;
  english: number;
  math: number;
}

export interface MenteeProfileData {
  id: string;
  name: string;
  school: string;
  grade: string; 
  profileImgUrl?: string | null;
  stats: MenteeProfileStats;
  achievement: MenteeAchievement;
}
