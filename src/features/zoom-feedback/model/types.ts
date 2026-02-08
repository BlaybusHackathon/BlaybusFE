export interface ZoomFeedbackData {
  id?: string;
  title?: string;
  memo: string;
  subjects: {
    korean: string;
    english: string;
    math: string;
  };
  operation: string;
  meetingDate?: string;
}

export interface ZoomFeedbackListItem {
  id: string;
  meetingDate: string;
  summary?: string;
}
