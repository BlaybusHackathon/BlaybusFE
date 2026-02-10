import { Subject } from '@/shared/constants/subjects';
import { asRecord, asOptionalString, pick } from '@/shared/api/parse';

export interface Weakness {
  id: string;       
  title: string;    
  inforId: string;   
  contentId: string; 

  menteeId: string; 
  subject: Subject; 
  fileName?: string;
  fileUrl?: string;  
}

const SUBJECT_VALUES: readonly Subject[] = ['KOREAN', 'ENGLISH', 'MATH', 'OTHER'];

const safeString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
};

const safeSubject = (value: unknown): Subject => {
  if (typeof value === 'string' && SUBJECT_VALUES.includes(value as Subject)) {
    return value as Subject;
  }
  return 'OTHER';
};

export const mapWeaknessFromApi = (raw: unknown): Weakness => {
  const obj = asRecord(raw, 'Weakness');
  const studyContent = obj.study_content;
  const studyRecord = studyContent && typeof studyContent === 'object' ? (studyContent as Record<string, unknown>) : undefined;

  return {
    id: safeString(pick(obj, ['id', 'weaknessId', 'weakness_id'])),
    title: safeString(pick(obj, ['title'])),
    inforId: safeString(pick(obj, ['inforId', 'infor_id'])),
    contentId: safeString(pick(obj, ['contentId', 'content_id'])),
    menteeId: safeString(pick(obj, ['menteeId', 'mentee_id'])),
    subject: safeSubject(pick(obj, ['subject'])),
    fileName:
      asOptionalString(pick(obj, ['fileName', 'file_name', 'contentTitle']), 'Weakness.fileName') ??
      (studyRecord ? asOptionalString(studyRecord.title, 'Weakness.studyContent.title') : undefined),
    fileUrl:
      asOptionalString(pick(obj, ['fileUrl', 'file_url', 'contentUrl', 'content_url']), 'Weakness.fileUrl') ??
      (studyRecord ? asOptionalString(studyRecord.content_url, 'Weakness.studyContent.content_url') : undefined),
  };
};
