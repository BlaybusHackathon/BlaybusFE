export interface MenteeInfo {
  id: string;
  schoolName: string;
  koreanGrade: number | null;
  mathGrade: number | null;
  englishGrade: number | null;
  createdAt: string;
  updatedAt: string | null;
  mentorId: string;
  menteeId: string;
}

import { asRecord, asString, asOptionalNumber, asOptionalString, pick } from '@/shared/api/parse';

export const mapMenteeInfoFromApi = (raw: unknown): MenteeInfo => {
  const obj = asRecord(raw, 'MenteeInfo');
  return {
    id: asString(pick(obj, ['id']), 'MenteeInfo.id'),
    schoolName: asString(pick(obj, ['schoolName', 'school_name']), 'MenteeInfo.schoolName'),
    koreanGrade: asOptionalNumber(pick(obj, ['koreanGrade', 'korean_grade']), 'MenteeInfo.koreanGrade') ?? null,
    mathGrade: asOptionalNumber(pick(obj, ['mathGrade', 'math_grade']), 'MenteeInfo.mathGrade') ?? null,
    englishGrade: asOptionalNumber(pick(obj, ['englishGrade', 'english_grade']), 'MenteeInfo.englishGrade') ?? null,
    createdAt: asString(pick(obj, ['createdAt', 'created_at']), 'MenteeInfo.createdAt'),
    updatedAt: asOptionalString(pick(obj, ['updatedAt', 'updated_at']), 'MenteeInfo.updatedAt') ?? null,
    mentorId: asString(pick(obj, ['mentorId', 'mentor_id']), 'MenteeInfo.mentorId'),
    menteeId: asString(pick(obj, ['menteeId', 'mentee_id']), 'MenteeInfo.menteeId'),
  };
};
