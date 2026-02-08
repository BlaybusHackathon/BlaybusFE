import { Subject } from '@/shared/constants/subjects';
import { asRecord, asString, asOptionalString, asEnum, pick } from '@/shared/api/parse';

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

export const mapWeaknessFromApi = (raw: unknown): Weakness => {
  const obj = asRecord(raw, 'Weakness');
  const studyContent = obj.study_content;
  const studyRecord = studyContent && typeof studyContent === 'object' ? (studyContent as Record<string, unknown>) : undefined;

  return {
    id: asString(pick(obj, ['id', 'weaknessId', 'weakness_id']), 'Weakness.id'),
    title: asString(pick(obj, ['title']), 'Weakness.title'),
    inforId: asString(pick(obj, ['inforId', 'infor_id']), 'Weakness.inforId'),
    contentId: asString(pick(obj, ['contentId', 'content_id']), 'Weakness.contentId'),
    menteeId: asString(pick(obj, ['menteeId', 'mentee_id']), 'Weakness.menteeId'),
    subject: asEnum(pick(obj, ['subject']), SUBJECT_VALUES, 'Weakness.subject'),
    fileName:
      asOptionalString(pick(obj, ['fileName', 'file_name', 'contentTitle']), 'Weakness.fileName') ??
      (studyRecord ? asOptionalString(studyRecord.title, 'Weakness.studyContent.title') : undefined),
    fileUrl:
      asOptionalString(pick(obj, ['fileUrl', 'file_url', 'contentUrl', 'content_url']), 'Weakness.fileUrl') ??
      (studyRecord ? asOptionalString(studyRecord.content_url, 'Weakness.studyContent.content_url') : undefined),
  };
};
