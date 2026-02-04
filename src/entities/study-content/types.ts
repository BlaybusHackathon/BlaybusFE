import { Subject } from '@/shared/constants/enums';

export interface StudyContent {
  id: string;
  title: string;
  subject: Subject;
  contentUrl: string | null;
  createdAt: string;
  mentorId: string | null;
}

export const mapStudyContentFromApi = (raw: any): StudyContent => ({
  id: String(raw.id),
  title: raw.title,
  subject: raw.subject,
  contentUrl: raw.content_url,
  createdAt: raw.created_at,
  mentorId: raw.mentor_id ? String(raw.mentor_id) : null,
});