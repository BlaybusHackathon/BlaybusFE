import { Subject } from '@/shared/constants/enums';
import { asRecord, asString, asOptionalString, asEnum, pick } from '@/shared/api/parse';

export interface StudyContent {
  id: string;
  title: string;
  subject: Subject;
  contentUrl: string | null;
  createdAt: string;
  mentorId: string | null;
}

const SUBJECT_VALUES: readonly Subject[] = ['KOREAN', 'ENGLISH', 'MATH', 'OTHER'];

export const mapStudyContentFromApi = (raw: unknown): StudyContent => {
  const obj = asRecord(raw, 'StudyContent');
  return {
    id: asString(pick(obj, ['id', 'contentId', 'studyContentId', 'study_content_id']), 'StudyContent.id'),
    title: asString(pick(obj, ['title', 'name', 'fileName', 'file_name']), 'StudyContent.title'),
    subject: asEnum(pick(obj, ['subject', 'subjectType', 'category']), SUBJECT_VALUES, 'StudyContent.subject'),
    contentUrl: asOptionalString(
      pick(obj, ['contentUrl', 'content_url', 'fileUrl', 'file_url', 'url', 'path']),
      'StudyContent.contentUrl'
    ) ?? null,
    createdAt: asString(pick(obj, ['createdAt', 'created_at']), 'StudyContent.createdAt'),
    mentorId: asOptionalString(pick(obj, ['mentorId', 'mentor_id']), 'StudyContent.mentorId') ?? null,
  };
};
